import { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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
import { toast } from "sonner-native";
import { UploadPatientDocument } from "~/services/documents";
type DocumentTypeProps = {
  id: string;
  name: string;
  icon: React.ReactNode;
  selected: boolean;
  color: string;
  bgColor: string;
  onPress: () => void;
  disabled?: boolean;
};
const documentTypes = [
  {
    id: "lab",
    name: "Lab Results",
    icon: <FileText size={24} color="#4A90E2" />,
    color: "#4A90E2",
    bgColor: "rgba(74, 144, 226, 0.1)",
  },
  {
    id: "imaging",
    name: "Imaging",
    icon: <ImageIcon size={24} color="#50C878" />,
    color: "#50C878",
    bgColor: "rgba(80, 200, 120, 0.1)",
  },
  {
    id: "prescriptions",
    name: "Prescriptions",
    icon: <FileText size={24} color="#FF6B6B" />,
    color: "#FF6B6B",
    bgColor: "rgba(255, 107, 107, 0.1)",
  },
  {
    id: "clinical",
    name: "Clinical Notes",
    icon: <FileText size={24} color="#FFD700" />,
    color: "#FFD700",
    bgColor: "rgba(255, 215, 0, 0.1)",
  },
  {
    id: "other",
    name: "Other Documents",
    icon: <FileText size={24} color="#9E9E9E" />,
    color: "#9E9E9E",
    bgColor: "rgba(158, 158, 158, 0.1)",
  },
];

// Maximum file size in bytes (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg,.jpeg",
  "image/png": ".png",
  "image/heic": ".heic",
};

function DocumentTypeCard({
  id,
  name,
  icon,
  selected,
  color,
  bgColor,
  onPress,
  disabled = false,
}: DocumentTypeProps) {
  return (
    <TouchableOpacity
      key={id}
      onPress={onPress}
      disabled={disabled}
      className={`w-[47%] mx-[1.5%] mb-4 p-4 rounded-lg items-center border ${selected
          ? ""
          : "border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary"
        }`}
      style={
        selected
          ? {
            borderColor: color,
            backgroundColor: bgColor,
          }
          : undefined
      }
    >
      <View
        className="w-12 h-12 rounded-full justify-center items-center mb-2"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </View>
      <Text className="font-jakarta-medium text-sm text-center">{name}</Text>
    </TouchableOpacity>
  );
}
export default function AddRecordScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: Object.keys(ALLOWED_FILE_TYPES),
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Validate file size
        if (asset.size && asset.size > MAX_FILE_SIZE) {
          toast.error(
            `File too large (max ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)`,
          );
          return;
        }

        // Check if file type is in allowed types
        if (
          asset.mimeType &&
          !Object.keys(ALLOWED_FILE_TYPES).includes(asset.mimeType)
        ) {
          toast.error("Unsupported file type");
          return;
        }

        setSelectedFile(asset);
        toast.success(`${asset.name} selected`);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      toast.error("Error selecting document");
    }
  };

  const handleCameraCapture = () => {
    if (Platform.OS === "web") {
      toast.warning("Camera capture is not available on web");
      return;
    }

    // Implement camera functionality with ImagePicker
    toast.info("Camera functionality will be implemented soon");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };
  const handleUpload = async () => {
    if (!selectedType || !selectedFile) {
      toast.error("Please select a document type and file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    let progressInterval: NodeJS.Timeout | null = null;

    try {
      const fileName = selectedFile.name || "document";
      const mimeType = selectedFile.mimeType || "application/octet-stream";

      // Create FormData object correctly
      const formData = new FormData();

      // Check if we're running on web platform
      if (Platform.OS === "web") {
        // For web, we need to handle the file differently
        formData.append("document", selectedFile as any);
      } else {
        // For native platforms (iOS, Android)
        formData.append("document", {
          uri: selectedFile.uri,
          name: fileName,
          type: mimeType,
        } as any);
      }

      // Add metadata as a separate field
      formData.append(
        "metadata",
        JSON.stringify({
          title: fileName,
        }),
      );

      // Simulate progress for better UX (this will be replaced by actual progress events in production)
      let lastProgress = 0;
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          // Make progress more realistic - slower at beginning and end
          const increment = prev < 30 ? 2 : prev > 70 ? 0.5 : 1;
          const newProgress = prev + Math.random() * increment;
          lastProgress = newProgress >= 90 ? 90 : newProgress;
          return lastProgress;
        });
      }, 300);

      // Perform the actual upload
      await UploadPatientDocument(formData);

      // Clear interval and set to 100% when complete
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      setUploadProgress(100);
      toast.success("Document uploaded successfully");

      // Reset form and navigate back after success
      setTimeout(() => {
        setSelectedFile(null);
        setSelectedType(null);
        setUploading(false);
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);

      // Clear any existing interval
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      // Provide more specific error message if possible
      let errorMessage = "Upload failed. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage =
            "Upload timed out. Please try again with a smaller file or better connection.";
        }
      }

      toast.error(errorMessage);
      setUploadProgress(0);
    } finally {
      // Ensure interval is cleared in all cases
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploading(false);
    }
  };
  const getTypeById = (id: string) =>
    documentTypes.find((type) => type.id === id) || null;
  const selectedTypeObj = selectedType ? getTypeById(selectedType) : null;

  return (
    <View className="flex-1 ">
      {/* Header */}
      <View className="flex-row justify-between items-center px-2 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex items-center flex-row"
          disabled={uploading}
        >
          <ArrowLeft color="#24AE7C" size={24} />
          <Text className="ml-2 font-jakarta-semibold">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Document Type Selection */}
        <Text className="font-jakarta-semibold text-base mb-4 mt-4">
          Select Document Type
        </Text>

        <View className="flex-row flex-wrap -mx-1.5">
          {documentTypes.map((type) => (
            <DocumentTypeCard
              key={type.id}
              id={type.id}
              name={type.name}
              icon={type.icon}
              selected={selectedType === type.id}
              color={type.color}
              bgColor={type.bgColor}
              onPress={() => setSelectedType(type.id)}
              disabled={uploading}
            />
          ))}
        </View>

        {/* Upload Options */}
        <Text className="font-jakarta-semibold text-base mb-4 mt-8">
          Upload Document
        </Text>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="w-[48%] p-6 rounded-lg items-center justify-center border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary"
            onPress={handlePickDocument}
            disabled={uploading}
          >
            <FileText color="#24AE7C" size={32} />
            <Text className="font-jakarta-medium text-sm mt-2 text-center">
              Browse Files
            </Text>
            <Text className="text-xs text-gray-500 mt-1 text-center">
              PDF, JPG, PNG
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[48%] p-6 rounded-lg items-center justify-center border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-backgroundPrimary"
            onPress={handleCameraCapture}
            disabled={uploading || Platform.OS === "web"}
          >
            <Camera color="#24AE7C" size={32} />
            <Text className="font-jakarta-medium text-sm mt-2 text-center">
              Take Photo
            </Text>
            <Text className="text-xs text-gray-500 mt-1 text-center">
              {Platform.OS === "web" ? "Not available on web" : "Camera"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected File */}
        {selectedFile && (
          <View className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-backgroundPrimary border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View
                  className="w-10 h-10 rounded-lg justify-center items-center"
                  style={{
                    backgroundColor: selectedTypeObj
                      ? selectedTypeObj.bgColor
                      : "rgba(36, 174, 124, 0.1)",
                  }}
                >
                  <FileText
                    color={selectedTypeObj ? selectedTypeObj.color : "#24AE7C"}
                    size={24}
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text
                    className="font-jakarta-medium text-sm"
                    numberOfLines={1}
                  >
                    {selectedFile.name}
                  </Text>
                  {selectedFile.size && (
                    <Text className="font-jakarta-regular text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatFileSize(selectedFile.size)}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                className="w-8 h-8 rounded-full justify-center items-center bg-red-100 dark:bg-red-900"
                onPress={() => setSelectedFile(null)}
                disabled={uploading}
              >
                <X color="#FF6B6B" size={18} />
              </TouchableOpacity>
            </View>

            {uploading && (
              <View className="mt-3">
                <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-green-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {Math.round(uploadProgress)}%
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Additional info */}
        <View className="mt-6 mb-4">
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            • Maximum file size: 50MB
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            • Supported formats: PDF, JPG, PNG
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            • Please ensure patient information is clearly visible
          </Text>
        </View>
      </ScrollView>

      {/* Upload Button */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          className={`p-4 rounded-lg items-center ${selectedType && selectedFile && !uploading
              ? "bg-greenPrimary"
              : "bg-gray-300 dark:bg-gray-600"
            }`}
          onPress={handleUpload}
          disabled={!selectedType || !selectedFile || uploading}
        >
          {uploading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="font-jakarta-semibold text-white text-base ml-2">
                Uploading...
              </Text>
            </View>
          ) : (
            <Text className="font-jakarta-semibold text-white text-base">
              Upload Document
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
