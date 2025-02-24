import { SafeAreaView, View } from "react-native";
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
    </SafeAreaView>
  );
}
