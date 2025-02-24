import { View } from "react-native";

import { Role } from "~/context/AuthContext";
import { WithRole } from "~/components/WithRole";
import { PatientForm } from "~/components/onboarding/PatientForm";
import { DoctorForm } from "~/components/onboarding/DoctorForm";
function OnBoardingScreen() {
  return (
    <View className="py-4 px-6 mt-12">
      <WithRole role={Role.PATIENT}>
        <PatientForm />
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <DoctorForm />
      </WithRole>
    </View>
  );
}
export default OnBoardingScreen;
