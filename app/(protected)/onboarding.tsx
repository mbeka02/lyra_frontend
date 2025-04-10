import { SafeAreaView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Role } from "~/providers/AuthProvider";
import { WithRole } from "~/components/WithRole";
import { PatientForm } from "~/components/onboarding/PatientForm";
import { DoctorForm } from "~/components/onboarding/DoctorForm";
import { useAuthentication } from "~/providers/AuthProvider";
import { Logout } from "~/components/auth/Logout";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/lib/useColorScheme";
import { LogOut } from "lucide-react-native";
function OnBoardingScreen() {
  const { authState } = useAuthentication();
  const { isDarkColorScheme } = useColorScheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <SafeAreaView className="px-4 mt-12">
      <View className="flex-row justify-end mx-1 mt-2 mb-4  p-1 ">
        <Logout>
          <Button
            className="web:ring-offset-background border-none bg-transparent web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 mr-1"
            size="icon"
          >
            <LogOut
              strokeWidth={2}
              size={18}
              color={isDarkColorScheme ? "white" : "black"}
            />
          </Button>
        </Logout>
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
        <DoctorForm
          selectedIndex={selectedIndex}
          total={2}
          onIndexChange={(index) => setSelectedIndex(index)}
        />
      </WithRole>
    </SafeAreaView>
  );
}
export default OnBoardingScreen;
