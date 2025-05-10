import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import UserAvatar from "~/components/platform/shared/UserAvatar";
import { format } from "date-fns";
import { PatientUnderCare } from "~/services/types";
import { Href, useRouter } from "expo-router";
export default function PatientCard({
  user_id,
  patient_id,
  date_of_birth,
  full_name,
  profile_picture,
}: PatientUnderCare) {
  const age = new Date().getFullYear() - new Date(date_of_birth).getFullYear();
  const router = useRouter();

  return (
    <Pressable
      className="bg-slate-50 dark:bg-backgroundPrimary rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
      onPress={() => router.push(`/patients/${patient_id}` as Href)}
    >
      <UserAvatar uri={profile_picture} />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-jakarta-semibold text-gray-800">
          {full_name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-sm font-jakarta-regular text-gray-500">
            {`Age: ${age} • DOB: ${format(new Date(date_of_birth), "MMM dd, yyyy")}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
