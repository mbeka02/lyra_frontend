import { View } from "react-native";
import { ProfileForm } from "~/components/platform/shared/ProfileForm";
import { useNavigation } from "expo-router";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Text } from "~/components/ui/text";
export default function ProfileScreen() {
  const navigation = useNavigation();
  return (
    <View className="px-6">
      <Button
        className="mb-3"
        onPress={() => navigation.goBack()}
        size="icon"
        variant="link"
      >
        <ArrowLeft className="h-4 w-4 text-black dark:text-white" />
      </Button>
      <ProfileForm />
    </View>
  );
}
