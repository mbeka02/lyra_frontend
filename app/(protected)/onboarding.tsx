import { SafeAreaView, View, Platform } from "react-native";

import { Role } from "~/context/AuthContext";
import { WithRole } from "~/components/WithRole";
import { PatientForm } from "~/components/onboarding/patient-form";
import { SpecialistForm } from "~/components/onboarding/specialist-form";

function OnBoardingScreen() {
  return (
    <View className="py-4 px-6 mt-12">
      <SpecialistForm />
    </View>
  );
}
export default OnBoardingScreen;
