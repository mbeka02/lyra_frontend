import { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  FileText,
  Trash2,
  Share2,
  Download,
  UserPlus,
  Lock,
} from "lucide-react-native";
import { DocumentReference } from "@/types/fhir";
import { getMockDocuments } from "@/utils/mockData";
import { format } from "date-fns";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [document, setDocument] = useState<DocumentReference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadDocument = async () => {
      setLoading(true);
      const allDocs = getMockDocuments() as DocumentReference[];
      const doc = allDocs.find((d) => d.id === id) || null;
      setDocument(doc);
      setLoading(false);
    };

    loadDocument();
  }, [id]);

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

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // In a real app, this would call an API
            router.replace("/records");
          },
        },
      ],
    );
  };

  const handleManageConsent = () => {
    router.push(`/records`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const getDocumentTypeText = (doc: DocumentReference) => {
    return doc.type?.text || "Document";
  };

  const isImageDocument = (doc: DocumentReference) => {
    return doc.content[0]?.attachment.contentType?.startsWith("image/");
  };

  if (loading) {
    return (
      <View className="flex-1 ">
        <View className="flex-row justify-between items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#24AE7C" size={24} />
          </TouchableOpacity>
          <Text className="font-semibold text-lg text-center flex-1 ">
            Loading...
          </Text>
          <View className="w-6" />
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 dark:text-gray-400">
            Loading document...
          </Text>
        </View>
      </View>
    );
  }

  if (!document) {
    return (
      <View className="flex-1">
        <View className="flex-row justify-between items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#24AE7C" size={24} />
          </TouchableOpacity>
          <Text className="font-jakarta-semibold text-lg text-center flex-1 text-black dark:text-white">
            Not Found
          </Text>
          <View className="w-6" />
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className=" font-jakarta-semibold text-red-500">
            Document not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row justify-between items-center px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#24AE7C" size={24} />
        </TouchableOpacity>
        <Text
          className="font-jakarta-semibold text-lg text-center flex-1 "
          numberOfLines={1}
        >
          Document Details
        </Text>
        <TouchableOpacity onPress={handleDelete}>
          <Trash2 color="#FF6B6B" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="rounded-lg border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary overflow-hidden">
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
            {document.content[0]?.attachment.title || "Untitled Document"}
          </Text>

          {isImageDocument(document) && document.content[0]?.attachment.url && (
            <View className="w-full h-72 mb-4">
              <Image
                source={{ uri: document.content[0].attachment.url }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          )}

          {!isImageDocument(document) && (
            <View className="h-52 justify-center items-center mb-4 bg-gray-50 dark:bg-gray-700">
              <FileText color="#24AE7C" size={48} />
              <Text className="font-jakarta-medium text-base mt-2 text-black dark:text-white">
                PDF Document
              </Text>
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
                {document.content[0]?.attachment.contentType
                  ?.split("/")[1]
                  .toUpperCase() || "Unknown"}
              </Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-jakarta-regular text-sm w-20 text-gray-500 dark:text-gray-400">
                Status:
              </Text>
              <Text className="font-jakarta-medium text-sm flex-1 text-black dark:text-white">
                {document.status.charAt(0).toUpperCase() +
                  document.status.slice(1)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center p-4 bg-green-100/30 dark:bg-green-900/20">
            <Lock color="#22C55E" size={16} />
            <Text className="font-jakarta-medium text-sm ml-2 text-green-600 dark:text-green-400">
              Shared with 2 healthcare providers
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row p-4 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          className="flex-1 p-4 rounded-lg items-center justify-center mx-1 flex-row bg-slate-50 dark:bg-backgroundPrimary"
          onPress={handleShare}
        >
          <Share2 color="#24AE7C" size={20} />
          <Text className="font-jakarta-medium text-sm ml-1 ">Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 p-4 rounded-lg items-center justify-center mx-1 flex-row bg-slate-50 dark:bg-backgroundPrimary"
          onPress={() =>
            Alert.alert("Download", "This would download the document")
          }
        >
          <Download color="#24AE7C" size={20} />
          <Text className="font-jakarta-medium text-sm ml-1 ">Download</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 p-4 rounded-lg items-center justify-center mx-1 flex-row bg-green-500"
          onPress={handleManageConsent}
        >
          <UserPlus color="white" size={20} />
          <Text className="font-jakarta-medium text-sm ml-1 text-white">
            Manage Access
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
