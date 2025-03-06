import { SafeAreaView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Role } from "~/context/AuthContext";
import { WithRole } from "~/components/WithRole";
import { PatientForm } from "~/components/onboarding/PatientForm";
import { DoctorForm } from "~/components/onboarding/DoctorForm";
import { useAuthentication } from "~/context/AuthContext";
import { Logout } from "~/components/auth/Logout";
import { useState } from "react";
function OnBoardingScreen() {
  const { authState } = useAuthentication();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <SafeAreaView className="py-4 px-6 mt-12">
      <View className="flex-row justify-end mx-2 mt-2 mb-4 p-1 ">
        <Logout />
      </View>
      <View className="my-8">
        <Text className="text-2xl font-jakarta-semibold">
          Welcome {authState?.user?.full_name} 👋
        </Text>
        <Text className="font-jakarta-regular text-muted-foreground">
          Let us know more about yourself
        </Text>
      </View>
      <WithRole role={Role.PATIENT}>
        <PatientForm
          selectedIndex={selectedIndex}
          total={3}
          onIndexChange={(index) => setSelectedIndex(index)}
        />
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <DoctorForm />
      </WithRole>
    </SafeAreaView>
  );
}
export default OnBoardingScreen;
