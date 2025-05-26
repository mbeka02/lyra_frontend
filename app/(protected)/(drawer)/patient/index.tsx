import { WithRole } from "~/components/WithRole";

import { SafeAreaView } from "react-native";
import { Role } from "~/providers/AuthProvider";
import { PatientList } from "~/components/platform/doctor/PatientList";

export default function MyPatientsScreen() {
  return (
    <SafeAreaView>
      <WithRole role={Role.SPECIALIST}>
        <PatientList />
      </WithRole>
    </SafeAreaView>
  );
}
