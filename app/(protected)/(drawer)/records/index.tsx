import { View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Href, router } from "expo-router";
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
import { GradientText } from "~/components/GradientText";
import { usePatientDocuments } from "~/hooks/usePatientDocuments";
import { Role, useAuthentication } from "~/providers/AuthProvider";
import { Loader } from "~/components/Loader";
export default function RecordsScreen() {
  const { authState } = useAuthentication();
  const {
    isError,
    data: documents,
    isLoading,
  } = usePatientDocuments(authState?.user?.role as Role);
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
  if (isError) {
    return (
      <View className="flex-1">
        <Text className="font-jakarta-semibold text-xl mx-auto my-auto text-red-600">
          Error: Unable to load page info
        </Text>
      </View>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-4 pt-4 pb-4">
        <GradientText isUnderlined={true} text="Medical Records" />
        <View className="flex-row">
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center bg-slate-50 dark:bg-backgroundPrimary"
            onPress={() => router.push("/records")}
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
          onPress={() => router.push("/records")}
        >
          <Search color="#24AE7C" size={20} />
          <Text className="ml-2 font-jakarta-regular text-base text-gray-500 dark:text-gray-400">
            Search records...
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row p-4 rounded-xl mb-4 border bg-slate-50 shadow dark:bg-backgroundPrimary dark:border-gray-700"
            onPress={() => router.push(`/records/${item.id}` as Href)}
          >
            <View className="w-12 h-12 rounded-full justify-center items-center bg-green-50 dark:bg-greenPrimary/20">
              {getDocumentIcon(item)}
            </View>
            <View className="flex-1 ml-4">
              <Text
                className="font-jakarta-semibold text-base text-black dark:text-white"
                numberOfLines={1}
              >
                {item.content[0]?.attachment.title || "Document"}
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
        ListEmptyComponent={
          <View className="p-8 rounded-lg items-center justify-center mt-8 bg-slate-50 dark:bg-backgroundPrimary">
            <Text className="font-jakarta-regular text-base text-center text-gray-500 dark:text-gray-400">
              No records found
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        className="absolute bottom-8 right-8 w-15 h-15 rounded-full justify-center items-center bg-greenPrimary shadow-md"
        onPress={() => router.push("/records/add" as Href)}
      >
        <FilePlus color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}
