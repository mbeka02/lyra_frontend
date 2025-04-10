import { Role } from "~/providers/AuthProvider";
import { WithRole } from "~/components/WithRole";
import { DoctorList } from "~/components/platform/patient/DoctorList";
import { View } from "react-native";
export default function SearchScreen() {
  return (
    <View>
      <WithRole role={Role.PATIENT}>
        <View className="h-full">
          <DoctorList />
        </View>
      </WithRole>
    </View>
  );
}
