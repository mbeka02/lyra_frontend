import { Stack } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Stack>
  );
}
