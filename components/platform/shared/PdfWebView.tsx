import * as CSS from "csstype";
import * as FileSystem from "expo-file-system";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewNavigationEvent,
  WebViewSource,
} from "react-native-webview/lib/WebViewTypes";
import { Loader } from "~/components/Loader";

const {
  cacheDirectory,
  writeAsStringAsync,
  deleteAsync,
  getInfoAsync,
  EncodingType,
} = FileSystem;

export type RenderType =
  | "DIRECT_URL"
  | "DIRECT_BASE64"
  | "BASE64_TO_LOCAL_PDF"
  | "URL_TO_BASE64"
  | "GOOGLE_READER"
  | "GOOGLE_DRIVE_VIEWER";

export interface CustomStyle {
  readerContainer?: CSS.Properties;
  readerContainerDocument?: CSS.Properties;
  readerContainerNumbers?: CSS.Properties;
  readerContainerNumbersContent?: CSS.Properties;
  readerContainerZoomContainer?: CSS.Properties;
  readerContainerZoomContainerButton?: CSS.Properties;
  readerContainerNavigate?: CSS.Properties;
  readerContainerNavigateArrow?: CSS.Properties;
}

export interface Source {
  uri?: string;
  base64?: string;
  headers?: { [key: string]: string };
}

export interface Props {
  source: Source;
  style?: View["props"]["style"];
  webviewStyle?: WebView["props"]["style"];
  webviewProps?: WebView["props"];
  noLoader?: boolean;
  customStyle?: CustomStyle;
  useGoogleDriveViewer?: boolean;
  useGoogleReader?: boolean;
  withScroll?: boolean;
  withPinchZoom?: boolean;
  maximumPinchZoomScale?: number;
  onLoad?: (event: WebViewNavigationEvent) => void;
  onLoadEnd?: (event: WebViewNavigationEvent | WebViewErrorEvent) => void;
  onError?: (event: WebViewErrorEvent | WebViewHttpErrorEvent | string) => void;
}

const originWhitelist = [
  "http://*",
  "https://*",
  "file://*",
  "data:*",
  "content:*",
];

const htmlPath = `${cacheDirectory}index.html`;
const pdfPath = `${cacheDirectory}file.pdf`;

async function writePDFAsync(base64: string) {
  await writeAsStringAsync(
    pdfPath,
    base64.replace("data:application/pdf;base64,", ""),
    { encoding: EncodingType.Base64 },
  );
}

export async function removeFilesAsync(): Promise<void> {
  const { exists: htmlPathExist } = await getInfoAsync(htmlPath);
  if (htmlPathExist) {
    await deleteAsync(htmlPath, { idempotent: true });
  }

  const { exists: pdfPathExist } = await getInfoAsync(pdfPath);
  if (pdfPathExist) {
    await deleteAsync(pdfPath, { idempotent: true });
  }
}

const getGoogleReaderUrl = (url: string) => {
  const encodedUrl = encodeURIComponent(url);
  return `https://docs.google.com/viewer?url=${encodedUrl}`;
};
const getGoogleDriveUrl = (url: string) => {
  // Encode the entire signed URL before appending it
  const encodedUrl = encodeURIComponent(url);
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodedUrl}`;
};

const validate = ({
  onError,
  renderType,
  source,
}: {
  onError: (event: WebViewErrorEvent | WebViewHttpErrorEvent | string) => void;
  renderType: RenderType;
  source: Source;
}) => {
  if (!renderType || !source) {
    onError("source is undefined");
  } else if (
    (renderType === "DIRECT_URL" ||
      renderType === "GOOGLE_READER" ||
      renderType === "GOOGLE_DRIVE_VIEWER" ||
      renderType === "URL_TO_BASE64") &&
    (!source.uri ||
      !(
        source.uri.startsWith("http") ||
        source.uri.startsWith("file") ||
        source.uri.startsWith("content")
      ))
  ) {
    onError(
      `source.uri is undefined or not started with http, file or content source.uri = ${source.uri}`,
    );
  } else if (
    (renderType === "BASE64_TO_LOCAL_PDF" || renderType === "DIRECT_BASE64") &&
    (!source.base64 ||
      !source.base64.startsWith("data:application/pdf;base64,"))
  ) {
    onError(
      "Base64 is not correct (ie. start with data:application/pdf;base64,)",
    );
  }
};

const init = async ({
  renderType,
  setReady,
  source,
}: {
  renderType?: RenderType;
  setReady: Dispatch<SetStateAction<boolean>>;
  source: Source;
}) => {
  try {
    switch (renderType!) {
      case "GOOGLE_DRIVE_VIEWER": {
        break;
      }

      case "BASE64_TO_LOCAL_PDF": {
        await writePDFAsync(source.base64!);
        break;
      }

      default:
        break;
    }

    setReady(true);
  } catch (error) {
    console.error(error);
  }
};

const getRenderType = ({
  source,
  useGoogleDriveViewer,
  useGoogleReader,
}: {
  source: Source;
  useGoogleDriveViewer?: boolean;
  useGoogleReader?: boolean;
}) => {
  const { uri, base64 } = source;

  if (useGoogleReader && uri) {
    return "GOOGLE_READER";
  }

  if (useGoogleDriveViewer && uri) {
    return "GOOGLE_DRIVE_VIEWER";
  }

  if (Platform.OS === "ios") {
    if (uri !== undefined) {
      return "DIRECT_URL";
    }
    if (base64 !== undefined) {
      return "BASE64_TO_LOCAL_PDF";
    }
  }

  if (base64 !== undefined) {
    return "DIRECT_BASE64";
  }

  if (uri !== undefined) {
    return "DIRECT_URL";
  }

  return undefined;
};

const getWebviewSource = ({
  source,
  renderType,
  onError,
}: {
  source: Source;
  renderType?: RenderType;
  onError: (event: WebViewErrorEvent | WebViewHttpErrorEvent | string) => void;
}): WebViewSource | undefined => {
  const { uri, headers, base64 } = source;
  try {
    switch (renderType!) {
      case "GOOGLE_READER":
        if (!uri) throw new Error("URI required for Google Reader");
        return { uri: getGoogleReaderUrl(uri) };
      case "GOOGLE_DRIVE_VIEWER":
        if (!uri) throw new Error("URI required for Google Drive Viewer");
        return { uri: getGoogleDriveUrl(uri) };
      case "DIRECT_BASE64":
        if (!base64) throw new Error("Base64 required for Direct Base64");
        onError!(
          "DIRECT_BASE64 rendering might need specific implementation (Data URI or HTML)",
        );
        return { uri: base64 };
      case "URL_TO_BASE64":
        return { uri: htmlPath };
      case "DIRECT_URL":
        if (!uri) throw new Error("URI required for Direct URL");
        return { headers, uri: uri };
      case "BASE64_TO_LOCAL_PDF":
        if (!base64) throw new Error("Base64 required for Local PDF");
        return { uri: Platform.OS === "ios" ? pdfPath : `file://${pdfPath}` };
      default: {
        onError!(`Unknown or invalid RenderType: ${renderType}`);
        return undefined;
      }
    }
  } catch (error: any) {
    onError(error?.message || "Error determining WebView source");
    return undefined;
  }
};

const PdfWebViewer = ({
  source,
  style,
  webviewStyle,
  webviewProps,
  noLoader = false,
  useGoogleDriveViewer = false,
  useGoogleReader = false,
  onLoad,
  onLoadEnd,
  onError = console.error,
}: Props) => {
  const [ready, setReady] = useState<boolean>(false);
  const [currentRenderType, setCurrentRenderType] = useState<
    RenderType | undefined
  >(undefined);
  // Effect to determine render type and initialize
  useEffect(() => {
    const determinedType = getRenderType({
      source,
      useGoogleDriveViewer,
      useGoogleReader,
    });
    setCurrentRenderType(determinedType);

    if (determinedType) {
      console.debug("Determined RenderType:", determinedType);
      validate({ onError, renderType: determinedType, source });
      // Init now sets ready state internally after potential async ops
      init({ renderType: determinedType, setReady, source });
    } else {
      onError("Could not determine render type for the provided source.");
      setReady(false); // Ensure not ready if type is unknown
    }

    // Cleanup function
    return () => {
      if (
        determinedType === "DIRECT_BASE64" || // Add cleanup if DIRECT_BASE64 writes HTML
        // determinedType === "URL_TO_BASE64" || // Removed type
        determinedType === "BASE64_TO_LOCAL_PDF"
      ) {
        // Only remove files if these types were actually used
        removeFilesAsync().catch((err) =>
          console.error("Error during file cleanup:", err),
        );
      }
    };
  }, [source.uri, source.base64, useGoogleDriveViewer, useGoogleReader]); // Rerun if source or viewer props change

  // Calculate the source for the WebView
  const sourceToUse = useMemo(() => {
    // Ensure renderType is valid before getting source
    if (currentRenderType && source) {
      return getWebviewSource({
        onError,
        renderType: currentRenderType,
        source,
      });
    }
    return undefined; // Return undefined if type is not yet determined or invalid
  }, [currentRenderType, source, onError]); // Dependencies for source calculation

  // Handle WebView Load/Error events for better debugging
  const handleLoadEnd = (event: WebViewNavigationEvent | WebViewErrorEvent) => {
    console.log(
      "WebView Load End:",
      event.nativeEvent.title,
      event.nativeEvent.url,
    );
    if ("error" in event.nativeEvent) {
      // Check if it's an error event
      console.error("WebView Load End Error:", event.nativeEvent);
      // Call original onError if it was an error
      onError(event as WebViewErrorEvent);
    }
    if (onLoadEnd) {
      onLoadEnd(event);
    }
  };

  const handleWebViewError = (event: WebViewErrorEvent) => {
    console.error("WebView Error:", event.nativeEvent);
    onError(event); // Call the passed onError prop
  };

  const handleHttpError = (event: WebViewHttpErrorEvent) => {
    console.error("WebView HTTP Error:", event.nativeEvent);
    onError(event); // Call the passed onError prop
  };
  return (
    <View style={[styles.container, style]}>
      {/* Show loader UNTIL the WebView source is ready AND the component's ready state is true */}
      {(!ready || !sourceToUse) && !noLoader && (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      )}

      {/* Render WebView only when ready and source is calculated */}
      {ready && sourceToUse && (
        <WebView
          // Props passed down
          {...webviewProps}
          // Core props
          source={sourceToUse} // --- MODIFICATION: Pass source directly ---
          originWhitelist={originWhitelist}
          style={[styles.webview, webviewStyle]}
          // Event handlers for debugging/control
          onLoad={(event) => {
            console.log(
              "WebView Load Start:",
              event.nativeEvent.title,
              event.nativeEvent.url,
            );
            if (onLoad) onLoad(event);
          }}
          onLoadEnd={handleLoadEnd}
          onError={handleWebViewError}
          onHttpError={handleHttpError} // Catch HTTP errors specifically
          // Configuration props
          allowFileAccess // Keep true for file:// access if needed
          allowFileAccessFromFileURLs // Keep true for file:// access if needed
          allowUniversalAccessFromFileURLs // Keep true for file:// access if needed
          scalesPageToFit={Platform.select({ android: true, ios: true })} // Often useful for PDFs
          javaScriptEnabled={true} // Needed for some viewers/PDF JS libraries
          domStorageEnabled={true} // Might be needed by some viewers
          mixedContentMode={"compatibility"} // Be more lenient with mixed content
          sharedCookiesEnabled={false} // Good default for security
          startInLoadingState={!noLoader} // Show built-in loader initially
          renderLoading={() => (noLoader ? <View /> : <Loader />)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
  },
  webview: {
    flex: 1,
  },
});

export default PdfWebViewer;
