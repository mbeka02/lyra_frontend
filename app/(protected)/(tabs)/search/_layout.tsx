import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
