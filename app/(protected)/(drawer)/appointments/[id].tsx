import {
  CallContent,
  Call,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { PermissionsAndroid, View } from "react-native";
import { Text } from "~/components/ui/text";
export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  //initiate call
  useEffect(() => {
    //creates a new call
    const newCall = client?.call("default", id as string);
    /**
     * Will start to watch for call related WebSocket events and initiate a call session with the server.
     *
     * @returns a promise which resolves once the call join-flow has finished.
     */

    call?.join(
      //if true the call will be created if it doesn't exist
      { create: true },
    );
  }, []);
  if (!call) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>...nothing to see here yet 😉 (the session hasn't started)</Text>
      </View>
    );
  }
  return (
    <StreamCall call={call}>
      <View className="flex-1">
        <CallContent layout="spotlight" />
      </View>
    </StreamCall>
  );
}
