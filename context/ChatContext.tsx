import { useEffect, useState } from "react";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { Loader } from "~/components/Loader";
import { useAuthentication } from "./AuthContext";
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
export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //state that tracks whether the streamClient is ready
  const [isInitialized, setIsInitialized] = useState(false);
  const { authState } = useAuthentication();
  useEffect(() => {
    //return if user is not authed
    if (!authState?.isAuthenticated) return;
    const user = {
      id: authState.user?.user_id.toString() || "",
      name: authState.user?.full_name || "",
    };
    const connectUser = async () => {
      await streamClient.connectUser(
        {
          name: user.name || "",
          id: user.id,
        },
        authState.getStreamToken,
      );
      setIsInitialized(true);
    };
    connectUser();
    // Cleanup function to disconnect user when component unmounts
    // or when authentication state changes
    return () => {
      if (isInitialized) {
        streamClient.disconnectUser();
      }
      setIsInitialized(false);
    };
  }, [authState?.isAuthenticated]);
  if (!isInitialized) return <Loader />;

  return (
    <OverlayProvider /*value={{ style: chatTheme }}*/>
      <Chat client={streamClient}>{children}</Chat>
    </OverlayProvider>
  );
}
