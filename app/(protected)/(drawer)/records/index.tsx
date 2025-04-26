import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { Href, router } from "expo-router";
import { getMockDocuments } from "@/utils/mockData";
import { DocumentReference } from "@/types/fhir";
import {
  FileText,
  Image as ImageIcon,
  FilePlus,
  Search,
  Filter,
} from "lucide-react-native";
import { format } from "date-fns";

export default function RecordsScreen() {
  const colorScheme = useColorScheme();

  const [documents, setDocuments] = useState<DocumentReference[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    // In a real app, this would use actual API calls
    setDocuments(getMockDocuments() as DocumentReference[]);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getDocumentIcon = (doc: DocumentReference) => {
    const contentType = doc.content[0]?.attachment.contentType;
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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View className="flex-row justify-between items-center px-4 pt-4 pb-4">
        <Text className="font-bold text-2xl text-black dark:text-white">
          Medical Records
        </Text>
        <View className="flex-row">
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center bg-gray-100 dark:bg-gray-800"
            onPress={() => router.push("/records")}
          >
            <Search color="#24AE7C" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center ml-2 bg-gray-100 dark:bg-gray-800"
            onPress={() => console.log("Filter")}
          >
            <Filter color="#24AE7C" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 pb-4 bg-white dark:bg-black">
        <TouchableOpacity
          className="flex-row items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
          onPress={() => router.push("/records")}
        >
          <Search color="#24AE7C" size={20} />
          <Text className="ml-2 font-normal text-base text-gray-500 dark:text-gray-400">
            Search records...
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row p-4 rounded-lg mb-4 border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            onPress={() => router.push(`/records/${item.id}` as Href)}
          >
            <View className="w-12 h-12 rounded-full justify-center items-center bg-green-50 dark:bg-green-900/20">
              {getDocumentIcon(item)}
            </View>
            <View className="flex-1 ml-4">
              <Text
                className="font-semibold text-base text-black dark:text-white"
                numberOfLines={1}
              >
                {item.content[0]?.attachment.title || "Document"}
              </Text>
              <Text className="font-medium text-sm text-green-600 dark:text-green-400 mt-1">
                {getDocumentTypeText(item)}
              </Text>
              <Text className="font-normal text-sm mt-0.5 text-gray-500 dark:text-gray-400">
                {formatDate(item.date)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        className="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="p-8 rounded-lg items-center justify-center mt-8 bg-gray-100 dark:bg-gray-800">
            <Text className="font-normal text-base text-center text-gray-500 dark:text-gray-400">
              No records found
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        className="absolute bottom-8 right-8 w-15 h-15 rounded-full justify-center items-center bg-green-500 shadow-md"
        onPress={() => router.push("/records/add" as Href)}
      >
        <FilePlus color="white" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
