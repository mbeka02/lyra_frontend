import { SafeAreaView } from "react-native";
import { DoctorList } from "~/components/patient/DoctorList";
import { WithRole } from "~/components/WithRole";
import { Role } from "~/context/AuthContext";
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <WithRole role={Role.PATIENT}>
        <DoctorList />
      </WithRole>
    </SafeAreaView>
  );
}
