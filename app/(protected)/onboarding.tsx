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
    <SafeAreaView className="px-4 mt-12">
      <View className="flex-row justify-end mx-1 mt-2 mb-4  p-1 ">
        <Logout />
      </View>
      <View className="mt-6 px-4 py-2 ">
        <Text className="text-3xl font-jakarta-semibold mb-1">
          Hey there {authState?.user?.full_name.split(/\s/)[0] || "user"} 👋,
        </Text>
        <Text className="font-jakarta-regular text-lg mb-2 text-muted-foreground">
          Tell us more about yourself
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
