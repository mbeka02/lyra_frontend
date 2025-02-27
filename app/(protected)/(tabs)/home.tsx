import { SafeAreaView, View } from "react-native";
import { Scheduler } from "~/components/platform/doctor/Scheduler";
import { DoctorList } from "~/components/platform/patient/DoctorList";
import { WithRole } from "~/components/WithRole";
import { Role } from "~/context/AuthContext";
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <WithRole role={Role.PATIENT}>
        <View className="h-[90%]">
          <DoctorList />
        </View>
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <View className="h-[90%]">
          <Scheduler />
        </View>
      </WithRole>
    </SafeAreaView>
  );
}
