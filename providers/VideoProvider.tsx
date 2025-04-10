/**
 * VideoProvider.tsx
 *
 * This provider integrates Stream Video functionality into the application.
 * It manages the connection to Stream's video service, handling user authentication
 * and providing the video client to child components for video calling features.
 */
import { useAuthentication } from "./AuthProvider";
import {
  StreamVideoClient,
  StreamVideo,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useRef, useState } from "react";
import { Loader } from "~/components/Loader";

// Get the Stream API key from environment variables
const apiKey = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string;

/**
 * Provider component that initializes and manages the Stream Video connection
 * Connects the current user to Stream Video using their authentication details
 */
export default function VideoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to hold the Stream Video client instance
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null,
  );
  // Get authentication state from AuthProvider
  const { authState } = useAuthentication();
  const isConnectedRef = useRef(false);
  // Initialize and connect to Stream Video when the user is authenticated
  useEffect(() => {
    // Skip if auth state is not available
    if (!authState?.isAuthenticated) {
      // If we were previously connected, disconnect the user
      if (isConnectedRef.current && videoClient) {
        videoClient
          .disconnectUser()
          .then(() => {
            isConnectedRef.current = false;
            setVideoClient(null);
          })
          .catch((err) => {
            console.error("Error disconnecting user:", err);
          });
      }

      return;
    }

    /**
     * Initialize the Stream Video client with the current user's credentials
     */
    const initVideoClient = async () => {
      const user = {
        id: authState.user?.user_id.toString() || "",
        name: authState.user?.email || "",
      };
      try {
        const client = new StreamVideoClient({
          apiKey,
          token: authState.getStreamToken!,
          user,
        });
        setVideoClient(client);
        isConnectedRef.current = true;
      } catch (error) {
        console.error("error connecting the user");
      }
    };

    initVideoClient();

    // Cleanup function to disconnect user when component unmounts
    // or when authentication state changes
    return () => {
      if (videoClient && isConnectedRef.current && authState.isAuthenticated) {
        videoClient.disconnectUser();
      }
    };
  }, [authState?.isAuthenticated]);

  // Show loading indicator while connecting to Stream Video
  if (!videoClient) {
    return <Loader />;
  }

  // Provide Stream Video context to child components
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
