import { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, FileText, Share2, Download } from "lucide-react-native";
import { DocumentReference } from "@/types/fhir";
import { format } from "date-fns";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { Loader } from "~/components/Loader";
import { GetSignedURL } from "~/services/documents";
import { useAuthentication } from "~/providers/AuthProvider";
import { DocumentReferenceBundle } from "~/services/documents";
import { useQueryClient } from "@tanstack/react-query";
import PdfWebViewer from "~/components/platform/shared/PdfWebView";
export default function RecordDetailScreen() {
  const { id: documentId } = useLocalSearchParams<{ id: string }>();
  const { authState } = useAuthentication();
  const queryClient = useQueryClient();
  const [document, setDocument] = useState<DocumentReference | null>(null);
  const [signedURL, setSignedURL] = useState<string | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for this screen
  const [isFetchingUrl, setIsFetchingUrl] = useState(false); // Separate loading for signed URL
  const userId = authState?.user?.user_id;
  useEffect(() => {
    if (!documentId) {
      console.warn("Document ID  for cache key is missing");
      setDocument(null); // Set to null (not found) if IDs are missing
      setIsLoadingData(false);
      return;
    }
    setIsLoadingData(true);
    setSignedURL(null); // Reset signed URL when ID changes

    // Construct the query key used by the list hook
    const queryKey = ["myPatientDocuments", userId];
    // Get cached data without triggering a fetch
    const cachedBundle =
      queryClient.getQueryData<DocumentReferenceBundle>(queryKey);
    let foundDocument: DocumentReference | null | undefined = undefined;

    if (cachedBundle) {
      console.log("Raw Bundle found in cache:", cachedBundle);
      // --- Manually TRANSFORM the Bundle data ---
      const documentsArray: DocumentReference[] =
        cachedBundle.entry
          ?.map((entry) => entry.resource)
          .filter(
            (resource): resource is DocumentReference =>
              resource?.resourceType === "DocumentReference",
          ) ?? [];
      foundDocument = documentsArray.find((doc) => doc.id === documentId);
    }

    if (foundDocument) {
      console.log("Document found in cache:", documentId);
      setDocument(foundDocument);
      // Fetch signed URL immediately if document found in cache
      fetchSignedUrl(foundDocument);
      setIsLoadingData(false);
    } else {
      // --- Fallback: Document not in cache (or cache stale/missing) ---
      console.log(
        "Document not in cache, attempting refetch or dedicated fetch:",
        documentId,
      );

      console.error(
        `Document ${documentId} not found in cache. Implement detail fetch.`,
      );
      setDocument(null); // Set to null (not found)
      setIsLoadingData(false);
    }
  }, [documentId, userId, queryClient]);
  // --- Function to fetch signed URL ---
  const fetchSignedUrl = async (doc: DocumentReference | null) => {
    if (!doc?.content?.[0]?.attachment?.url) {
      console.warn("Document has no attachment URL to sign.");
      setSignedURL(null);
      return;
    }
    setIsFetchingUrl(true);
    try {
      const url = await GetSignedURL(doc.content[0].attachment.url);
      setSignedURL(url);
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      // Optionally show toast error
      setSignedURL(null); // Clear URL on error
    } finally {
      setIsFetchingUrl(false);
    }
  };
  const handleShare = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "Sharing is not available on web");
      return;
    }

    try {
      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        Alert.alert(
          "Share",
          "This would open a share dialog to share this record",
        );
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error sharing document:", error);
      Alert.alert("Error", "Failed to share document");
    }
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const getDocumentTypeText = (doc: DocumentReference) => {
    return doc.type?.text || "Document";
  };

  const isImageDocument = (doc: DocumentReference) => {
    return (
      doc.content?.[0]?.attachment?.contentType?.startsWith("image/") || false
    );
  };

  if (isLoadingData) {
    return (
      <View className="flex-1">
        <View className="flex-row justify-between items-center px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center gap-1"
          >
            <ArrowLeft color="#24AE7C" size={24} />
            <Text className="ml-2 font-jakarta-semibold">Back</Text>
          </TouchableOpacity>
        </View>
        <Loader />
      </View>
    );
  }

  if (document === null) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <View className="flex-row justify-between items-center px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center gap-1"
          >
            <ArrowLeft color="#24AE7C" size={24} />
            <Text className="ml-2 font-jakarta-semibold">Back</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="font-jakarta-semibold text-red-500">
            Document not found
          </Text>
          <TouchableOpacity
            className="mt-4 p-3  bg-greenPrimary rounded-lg"
            onPress={() => router.replace("/records")}
          >
            <Text className="font-jakarta-semibold text-white">
              Back to Records
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-4 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1"
        >
          <ArrowLeft color="#24AE7C" size={24} />
          <Text className="ml-2 font-jakarta-semibold">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1  p-4 ">
        <View className="rounded-lg border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary   overflow-hidden">
          <View className="flex-row justify-between items-center p-4">
            <View className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/20">
              <Text className="font-jakarta-medium text-xs text-green-600 dark:text-green-400">
                {getDocumentTypeText(document)}
              </Text>
            </View>
            <Text className="font-jakarta-regular text-sm text-gray-500 dark:text-gray-400">
              {formatDate(document.date)}
            </Text>
          </View>

          <Text className="font-jakarta-bold text-xl px-4 pb-4 text-black dark:text-white">
            {document.content?.[0]?.attachment?.title || "Untitled Document"}
          </Text>

          {isImageDocument(document) && signedURL && (
            <View className="w-full h-72 mb-4">
              <Image
                source={{ uri: signedURL }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          )}

          {!isImageDocument(document) && signedURL && (
            <View className="w-full h-72 mb-4">
              <PdfWebViewer
                source={{
                  uri: signedURL,
                }}
              />
            </View>
          )}

          <View className="p-4">
            <Text className="font-jakarta-semibold text-base mb-4 text-black dark:text-white">
              Document Information
            </Text>

            <View className="flex-row mb-2">
              <Text className="font-jakarta-regular text-sm w-20 text-gray-500 dark:text-gray-400">
                Type:
              </Text>
              <Text className="font-jakarta-medium text-sm flex-1 text-black dark:text-white">
                {getDocumentTypeText(document)}
              </Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-jakarta-regular text-sm w-20 text-gray-500 dark:text-gray-400">
                Date:
              </Text>
              <Text className="font-jakarta-medium text-sm flex-1 text-black dark:text-white">
                {formatDate(document.date)}
              </Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-jakarta-regular text-sm w-20 text-gray-500 dark:text-gray-400">
                Format:
              </Text>
              <Text className="font-jakarta-medium text-sm flex-1 text-black dark:text-white">
                {document.content?.[0]?.attachment?.contentType
                  ?.split("/")[1]
                  ?.toUpperCase() || "Unknown"}
              </Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-jakarta-regular text-sm w-20 text-gray-500 dark:text-gray-400">
                Status:
              </Text>
              <Text className="font-jakarta-medium text-sm flex-1 text-black dark:text-white">
                {document.status?.charAt(0).toUpperCase() +
                  document.status?.slice(1) || "Unknown"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="hidden p-4 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          className="flex-1 p-4 rounded-lg items-center justify-center mx-1 flex-row bg-slate-50 dark:bg-backgroundPrimary"
          onPress={handleShare}
        >
          <Share2 color="#24AE7C" size={20} />
          <Text className="font-jakarta-medium text-sm ml-1 text-black dark:text-white">
            Share
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 p-4 rounded-lg items-center justify-center mx-1 flex-row bg-slate-50 dark:bg-backgroundPrimary"
          onPress={() =>
            Alert.alert("Download", "This would download the document")
          }
        >
          <Download color="#24AE7C" size={20} />
          <Text className="font-jakarta-medium text-sm ml-1 text-black dark:text-white">
            Download
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
