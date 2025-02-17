import { SafeAreaView, View, Platform } from "react-native";

import { Role } from "~/context/AuthContext";
import { WithRole } from "~/components/WithRole";
import { PatientForm } from "~/components/onboarding/patient-form";
import { SpecialistForm } from "~/components/onboarding/specialist-form";

export default function OnBoardingScreen() {
  return (
    <View className="py-4 px-6 mt-12">
      <WithRole role={Role.PATIENT}>
        <PatientForm />
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <SpecialistForm />
      </WithRole>
    </View>
  );
}
