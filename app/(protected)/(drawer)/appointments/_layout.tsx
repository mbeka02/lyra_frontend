import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
export default function SettingsLayout() {
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
      }}
      edges={Platform.select({
        ios: ["top", "right", "left"],
        android: ["top", "right", "left"],
      })}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="[id]"
          options={
            {
              // headerShown: false,
            }
          }
        />
      </Stack>
    </SafeAreaView>
  );
}
