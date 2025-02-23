import { getUser, updateAvatar, updateUser } from "~/services/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pressable, View } from "react-native";
import FormInput from "../form/FormInput";
import { Loader } from "../Loader";
import { profileSchema } from "~/types/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react-native";
import { toast } from "sonner-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useEffect, useState } from "react";
import * as expoImagePicker from "expo-image-picker";
import UserAvatar from "./UserAvatar";
import { Pencil } from "lucide-react-native";
type FormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUser,
  });
  const [image, setImage] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      telephone_number: "",
    },
  });

  // Update form values when data is available
  useEffect(() => {
    if (data) {
      reset({
        full_name: data.full_name || "",
        email: data.email || "",
        telephone_number: data.telephone_number || "",
      });
      setImage(data.profile_image_url);
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    try {
      await updateUser(formData);
      toast.success("Your details have been updated");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update your details");
    }
  };

  const pickAndUpload = async () => {
    try {
      const { status } =
        await expoImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        toast.warning(
          "Permission required. Please grant access to your media gallery.",
        );
        return;
      }

      const result = await expoImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        toast.info("Image selection canceled.");
        return;
      }

      // Ensure there's at least one asset
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Use default values if not provided
        const fileName = asset.fileName || "profile.jpg";
        const mimeType = asset.mimeType || "image/jpeg";
        // const img = await fetchImageFromUri(asset.uri);
        setImage(asset.uri);
        const formData = new FormData();
        // formData.append("image", img); // TypeScript fix for FormData
        formData.append("image", {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
        } as any); // TypeScript fix for FormData
        await updateAvatar(formData);
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Image uploaded successfully.");
      } else {
        toast.error("No image selected.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Unable to upload your avatar. Please try again.");
    }
  };
  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  if (isLoading || !data) {
    return <Loader />;
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-jakarta-semibold text-red-600">
          Error: Unable to display page details
        </Text>
        <Button
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ["userProfile"] })
          }
          className="mt-4 font-jakarta-semibold text-white bg-red-600"
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View className="rounded-xl shadow-sm px-4  dark:bg-backgroundPrimary bg-slate-50">
      <View className="relative mx-auto my-6 w-24 h-24">
        <UserAvatar uri={image} name={data.full_name} size={96} />
        <Pressable
          className="h-9 w-9 flex bg-greenPrimary rounded-full  justify-center items-center absolute -bottom-3 -right-8 "
          onPress={pickAndUpload}
        >
          <Pencil color="white" strokeWidth="2" size="15" />
        </Pressable>
      </View>
      <FormInput name="full_name" title="Full Name" control={control} />
      <FormInput
        name="email"
        title="Email"
        icon={Mail}
        control={control}
        iconPosition="left"
      />
      <FormInput
        name="telephone_number"
        title="Telephone Number"
        control={control}
      />

      <Button
        className="bg-greenPrimary font-jakarta-semibold py-2 px-1 my-8 rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-jakarta-semibold">Save</Text>
      </Button>
    </View>
  );
}
