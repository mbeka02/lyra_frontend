import { View, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { DocumentReference } from "@/types/fhir";
import {
  FileText,
  Image as ImageIcon,
  FilePlus,
  Search,
  Filter,
} from "lucide-react-native";
import { format } from "date-fns";
import { Text } from "~/components/ui/text";
import { usePatientDocuments } from "~/hooks/usePatientDocuments";
import { Role, useAuthentication } from "~/providers/AuthProvider";
import { Loader } from "~/components/Loader";
import { router, Href } from "expo-router";
import { useState, useCallback } from "react";
import { toast } from "sonner-native";
import DocumentStorageManager from "~/utils/document_storage_manger";

export default function RecordsScreen() {
  const { authState } = useAuthentication();
  const [refreshing, setRefreshing] = useState(false);

  const {
    isError,
    data: documents,
    isLoading,
    refetch,
  } = usePatientDocuments(authState?.user?.role as Role);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      toast.error("unable to refresh documents");
      console.error("Error refreshing documents:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const getDocumentIcon = (doc: DocumentReference) => {
    const contentType = doc.content?.[0]?.attachment?.contentType;
    if (contentType?.startsWith("image/")) {
      return <ImageIcon color="#24AE7C" size={24} />;
    }
    return <FileText color="#24AE7C" size={24} />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getDocumentTypeText = (doc: DocumentReference) => {
    return doc.type?.text || "Document";
  };

  const navigateToDocumentDetail = async (document: DocumentReference) => {
    try {
      if (document && document.id) {
        await DocumentStorageManager.saveDocument(document);
      }

      router.push(`/records/${document.id}` as Href);
    } catch (error) {
      console.error("Error storing document data:", error);
      toast.error("Unable to open document");
    }
  };

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-jakarta-semibold text-xl text-red-600">
          Error: Unable to load records
        </Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-green-100 rounded-lg"
          onPress={onRefresh}
        >
          <Text className="font-jakarta-medium text-green-600">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && !refreshing) {
    return <Loader />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row  justify-end items-center px-4 pt-4 pb-4">
        <View className="flex-row">
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center bg-slate-50 dark:bg-backgroundPrimary"
            onPress={() => router.push("/records" as Href)}
          >
            <Search color="#24AE7C" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center ml-2 bg-slate-50 dark:bg-backgroundPrimary"
            onPress={() => console.log("Filter")}
          >
            <Filter color="#24AE7C" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 pb-4 bg-white dark:bg-black">
        <TouchableOpacity
          className="flex-row items-center p-4 rounded-lg bg-slate-50 dark:bg-backgroundPrimary"
          onPress={() => router.push("/records" as Href)}
        >
          <Search color="#24AE7C" size={20} />
          <Text className="ml-2 font-jakarta-regular text-base text-gray-500 dark:text-gray-400">
            Search records...
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row p-4 rounded-xl mb-4 border bg-slate-50 shadow dark:bg-backgroundPrimary dark:border-gray-700"
            onPress={() => navigateToDocumentDetail(item)}
          >
            <View className="w-12 h-12 rounded-full justify-center items-center bg-green-50 dark:bg-greenPrimary/20">
              {getDocumentIcon(item)}
            </View>
            <View className="flex-1 ml-4">
              <Text
                className="font-jakarta-semibold text-base text-black dark:text-white"
                numberOfLines={1}
              >
                {item.content?.[0]?.attachment?.title || "Document"}
              </Text>
              <Text className="font-jakarta-medium text-sm text-green-600 dark:text-green-400 mt-1">
                {getDocumentTypeText(item)}
              </Text>
              <Text className="font-jakarta-regular text-sm mt-0.5 text-gray-500 dark:text-gray-400">
                {formatDate(item.date)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        className="p-4"
        contentContainerStyle={{ paddingBottom: 100 }} // Extra padding at bottom for FAB
        ListEmptyComponent={
          <View className="p-8 rounded-lg items-center justify-center mt-8 bg-slate-50 dark:bg-backgroundPrimary">
            <Text className="font-jakarta-regular text-base text-center text-gray-500 dark:text-gray-400">
              No records found
            </Text>
            <TouchableOpacity
              className="mt-4 p-3 bg-greenPrimary rounded-lg"
              onPress={() => router.push("/records/add" as Href)}
            >
              <Text className="font-jakarta-semibold text-white">
                Add Your First Record
              </Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#24AE7C"
            colors={["#24AE7C"]}
            progressBackgroundColor="#F0F9FF"
          />
        }
      />

      <TouchableOpacity
        className="absolute bottom-10 right-8 w-16 h-16 rounded-full justify-center items-center bg-greenPrimary shadow-md"
        onPress={() => router.push("/records/add" as Href)}
      >
        <FilePlus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}
