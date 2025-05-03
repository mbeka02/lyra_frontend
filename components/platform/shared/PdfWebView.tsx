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

const getGoogleReaderUrl = (url: string) =>
  `https://docs.google.com/viewer?url=${url}`;
const getGoogleDriveUrl = (url: string) =>
  `https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`;

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

  if (useGoogleReader) {
    return "GOOGLE_READER";
  }

  if (useGoogleDriveViewer) {
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
    return "URL_TO_BASE64";
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
  const { uri, headers } = source;

  switch (renderType!) {
    case "GOOGLE_READER":
      return { uri: getGoogleReaderUrl(uri!) };
    case "GOOGLE_DRIVE_VIEWER":
      return { uri: getGoogleDriveUrl(uri || "") };
    case "DIRECT_BASE64":
    case "URL_TO_BASE64":
      return { uri: htmlPath };
    case "DIRECT_URL":
      return { headers, uri: uri! };
    case "BASE64_TO_LOCAL_PDF":
      return { uri: pdfPath };
    default: {
      onError!("Unknown RenderType");
      return undefined;
    }
  }
};

const PdfWebViewer = ({
  source,
  style,
  webviewStyle,
  webviewProps,
  noLoader = false,
  useGoogleDriveViewer,
  useGoogleReader,
  onLoad,
  onLoadEnd,
  onError = console.error,
}: Props) => {
  const [ready, setReady] = useState<boolean>(false);
  const [renderType, setRenderType] = useState<RenderType | undefined>(
    undefined,
  );
  const [renderedOnce, setRenderedOnce] = useState<boolean>(false);

  useEffect(() => {
    if (renderType) {
      console.debug(renderType);
      validate({ onError, renderType, source });
      init({ renderType, setReady, source });
    }

    return () => {
      if (
        renderType === "DIRECT_BASE64" ||
        renderType === "URL_TO_BASE64" ||
        renderType === "BASE64_TO_LOCAL_PDF"
      ) {
        removeFilesAsync();
      }
    };
  }, [renderType]);

  useEffect(() => {
    if (source.uri || source.base64) {
      setReady(false);
      setRenderType(
        getRenderType({ source, useGoogleDriveViewer, useGoogleReader }),
      );
    }
  }, [source.uri, source.base64]);

  const sourceToUse = useMemo(() => {
    if (!!onError && renderType && source) {
      return getWebviewSource({ onError, renderType, source });
    }
    return undefined;
  }, [getWebviewSource, onError, renderType, source]);

  const isAndroid = useMemo(() => Platform.OS === "android", [Platform]);

  return ready ? (
    <View style={[styles.container, style]}>
      <WebView
        {...{
          onError,
          onHttpError: onError,
          onLoad: (event) => {
            setRenderedOnce(true);
            if (onLoad) {
              onLoad(event);
            }
          },
          onLoadEnd,
          originWhitelist,
          source: renderedOnce || !isAndroid ? sourceToUse : undefined,
          style: [styles.webview, webviewStyle],
        }}
        allowFileAccess={isAndroid}
        allowFileAccessFromFileURLs={isAndroid}
        allowUniversalAccessFromFileURLs={isAndroid}
        scalesPageToFit={Platform.select({ android: false })}
        mixedContentMode={isAndroid ? "always" : undefined}
        sharedCookiesEnabled={false}
        startInLoadingState={!noLoader}
        renderLoading={() => (noLoader ? <View /> : <Loader />)}
        {...webviewProps}
      />
    </View>
  ) : (
    <View style={styles.loaderContainer}>{!noLoader && <Loader />}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  webview: {
    flex: 1,
  },
});

export default PdfWebViewer;
