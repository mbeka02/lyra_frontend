import { SafeAreaView, View } from "react-native";
import AvailabilityForm from "~/components/doctor/AvailabilityFormDraft";
import { DoctorList } from "~/components/patient/DoctorList";
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
        <AvailabilityForm />
      </WithRole>
    </SafeAreaView>
  );
}
