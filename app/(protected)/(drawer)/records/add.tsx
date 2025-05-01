import { useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import {
  ArrowLeft,
  FileText,
  Camera,
  Image as ImageIcon,
  X,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";
import { GradientText } from "~/components/GradientText";
import { toast } from "sonner-native";
import { UploadPatientDocument } from "~/services/documents";

const documentTypes = [
  {
    id: "lab",
    name: "Lab Results",
    icon: <FileText size={24} />,
    color: "#4A90E2",
  },
  {
    id: "imaging",
    name: "Imaging",
    icon: <ImageIcon size={24} />,
    color: "#50C878",
  },
  {
    id: "prescriptions",
    name: "Prescriptions",
    icon: <FileText size={24} />,
    color: "#FF6B6B",
  },
  {
    id: "clinical",
    name: "Clinical Notes",
    icon: <FileText size={24} />,
    color: "#FFD700",
  },
  {
    id: "other",
    name: "Other Documents",
    icon: <FileText size={24} />,
    color: "#9E9E9E",
  },
];

export default function AddRecordScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        toast.info("file selection canceled");
        return;
      }
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name;
        const mimeType = asset.mimeType;
        setSelectedFile(asset);
        const formData = new FormData();
        //build the form data
        formData.append("document", {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
        } as any);
        formData.append("metadata", {
          title: fileName,
        } as any);
        await UploadPatientDocument(formData);
        //TODO: Consider invalidating some stale data here
        toast.success("your document has been uploaded successfully");
      } else {
        toast.error("no document selected");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      toast.error("Error:failed to pick document");
    }
  };

  const handleCameraCapture = () => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "Camera capture is not available on web");
      return;
    }
  };

  const handleUpload = async () => {
    if (!selectedType || !selectedFile) {
      Alert.alert(
        "Missing Information",
        "Please select a document type and file",
      );
      return;
    }

    setUploading(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUploading(false);
    Alert.alert("Success", "Document uploaded successfully", [
      { text: "OK", onPress: () => router.push("/records") },
    ]);
  };

  return (
    <View className="flex-1 ">
      <View className="flex-row justify-between items-center px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#24AE7C" size={24} />
        </TouchableOpacity>
        <GradientText isUnderlined={true} text="Add Medical Record" />
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="font-jakarta-semibold text-base  mb-4">
          Select Document Type
        </Text>

        <View className="flex-row flex-wrap -mx-1.5">
          {documentTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`w-[47%] mx-[1.5%] mb-4 p-4 rounded-lg items-center border ${selectedType === type.id
                  ? `border-[${type.color}] bg-opacity-20 bg-[${type.color}]`
                  : "border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary"
                }`}
              onPress={() => setSelectedType(type.id)}
            >
              <View
                className={`w-12 h-12 rounded-full justify-center items-center mb-2 bg-opacity-20 bg-[${type.color}]`}
              >
                <View className={`text-[${type.color}]`}>{type.icon}</View>
              </View>
              <Text className="font-jakarta-medium text-sm text-center ">
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-jakarta-semibold text-base  mb-4 mt-8">
          Upload Document
        </Text>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="w-[48%] p-6 rounded-lg items-center justify-center border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary"
            onPress={handlePickDocument}
          >
            <FileText color="#24AE7C" size={32} />
            <Text className="font-jakarta-medium text-sm  mt-2">
              Browse Files
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[48%] p-6 rounded-lg items-center justify-center border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary"
            onPress={handleCameraCapture}
          >
            <Camera color="#24AE7C" size={32} />
            <Text className="font-jakarta-medium text-sm  mt-2">
              Take Photo
            </Text>
          </TouchableOpacity>
        </View>

        {selectedFile && (
          <View className="flex-row items-center justify-between mt-6 p-4 rounded-lg bg-slate-50 dark:bg-backgroundPrimary">
            <View className="flex-row items-center flex-1 mr-2">
              <FileText color="#24AE7C" size={24} />
              <View className="ml-4 flex-1">
                <Text
                  className="font-jakarta-medium text-sm "
                  numberOfLines={1}
                >
                  {selectedFile.name}
                </Text>
                {selectedFile.size && (
                  <Text className="font-jakarta-regular text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              className="w-8 h-8 rounded-full justify-center items-center"
              onPress={() => setSelectedFile(null)}
            >
              <X color="#FF6B6B" size={20} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View className="p-4 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          className={`p-4 rounded-lg items-center ${selectedType && selectedFile
              ? "bg-green-500"
              : "bg-gray-300 dark:bg-gray-600"
            } ${uploading ? "opacity-70" : "opacity-100"}`}
          onPress={handleUpload}
          disabled={!selectedType || !selectedFile || uploading}
        >
          <Text className="font-jakarta-semibold text-white text-base">
            {uploading ? "Uploading..." : "Upload Document"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
