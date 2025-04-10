import { useEffect, useState, useRef } from "react";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { Loader } from "~/components/Loader";
import { useAuthentication } from "./AuthProvider";
import { StreamChat } from "stream-chat";
//get the public access key and init the streamClient
const streamClient = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string,
);

/**
 * Custom theme configuration for the Stream Chat UI components
 * Makes channel previews have a transparent background to match app styling
 */
const chatTheme = {
  channelPreview: {
    container: {
      backgroundColor: "transparent",
    },
  },
};
//TODO: CLEAN THIS UP
export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //state that tracks whether the streamClient is ready
  const [isInitialized, setIsInitialized] = useState(false);
  // Use a ref to track connection status that won't be affected by stale closures
  const isConnectedRef = useRef(false);
  const { authState } = useAuthentication();

  useEffect(() => {
    // Return if user is not authed
    if (!authState?.isAuthenticated) {
      // If we were previously connected, disconnect the user
      if (isConnectedRef.current) {
        streamClient
          .disconnectUser()
          .then(() => {
            isConnectedRef.current = false;
            setIsInitialized(false);
          })
          .catch((err) => {
            console.error("Error disconnecting user:", err);
          });
      }
      return;
    }

    const user = {
      id: authState.user?.user_id.toString() || "",
      name: authState.user?.full_name || "",
    };

    const connectUser = async () => {
      if (isConnectedRef.current) return;

      try {
        await streamClient.connectUser(
          {
            name: user.name || "",
            id: user.id,
          },
          authState.getStreamToken,
        );
        isConnectedRef.current = true;
        setIsInitialized(true);
      } catch (error) {
        console.error("Error connecting user:", error);
      }
    };

    connectUser();

    // Cleanup function to disconnect user when component unmounts
    return () => {
      // Only run disconnectUser if we're unmounting the entire component
      if (authState?.isAuthenticated && isConnectedRef.current) {
        streamClient
          .disconnectUser()
          .then(() => {
            isConnectedRef.current = false;
          })
          .catch((err) => {
            console.error("Error disconnecting user on unmount:", err);
          });
      }
    };
  }, [authState?.isAuthenticated]);
  if (!isInitialized) return <Loader />;

  return (
    <OverlayProvider value={{ style: chatTheme }}>
      <Chat client={streamClient}>{children}</Chat>
    </OverlayProvider>
  );
}
