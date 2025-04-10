import { Scheduler } from "~/components/platform/doctor/Scheduler";
import { WithRole } from "~/components/WithRole";
import { Role } from "~/providers/AuthProvider";
import { SafeAreaView, View } from "react-native";
import { PatientDashboard } from "~/components/platform/patient/PatientDashBoard";
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <WithRole role={Role.PATIENT}>
        <View className="h-full">
          <PatientDashboard />
        </View>
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <View className="h-full">
          <Scheduler />
        </View>
      </WithRole>
    </SafeAreaView>
  );
}
