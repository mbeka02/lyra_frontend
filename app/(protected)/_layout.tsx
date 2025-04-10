import { Stack } from "expo-router";
import ChatProvider from "~/providers/ChatProvider";
import VideoProvider from "~/providers/VideoProvider";
export default function ProtectedLayout() {
  return (
    <ChatProvider>
      <VideoProvider>
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
      </VideoProvider>
    </ChatProvider>
  );
}
