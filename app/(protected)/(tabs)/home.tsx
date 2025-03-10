import { SafeAreaView, View } from "react-native";
import { Scheduler } from "~/components/platform/doctor/Scheduler";
import { WithRole } from "~/components/WithRole";
import { Role } from "~/context/AuthContext";
import { Text } from "~/components/ui/text";
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <WithRole role={Role.PATIENT}>
        <Text className="m-auto font-jakarta-regular">Patient Home Screen</Text>
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <View className="h-[90%]">
          <Scheduler />
        </View>
      </WithRole>
    </SafeAreaView>
  );
}
