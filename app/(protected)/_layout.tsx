import { Stack } from "expo-router";
import ChatProvider from "~/context/ChatContext";
export default function ProtectedLayout() {
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ChatProvider>
  );
}
