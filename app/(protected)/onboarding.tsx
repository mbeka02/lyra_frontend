import { SafeAreaView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Role } from "~/context/AuthContext";
import { WithRole } from "~/components/WithRole";
import { PatientForm } from "~/components/onboarding/PatientForm";
import { DoctorForm } from "~/components/onboarding/DoctorForm";
import { useAuthentication } from "~/context/AuthContext";
function OnBoardingScreen() {
  const { authState } = useAuthentication();
  return (
    <SafeAreaView className="py-4 px-6 mt-12">
      <View className="mt-8 mb-4">
        <Text className="text-2xl font-jakarta-semibold">
          Welcome {authState?.user?.full_name} 👋
        </Text>
        <Text className="font-jakarta-regular text-muted-foreground">
          Let us know more about yourself
        </Text>
      </View>
      <WithRole role={Role.PATIENT}>
        <PatientForm />
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <DoctorForm />
      </WithRole>
    </SafeAreaView>
  );
}
export default OnBoardingScreen;
