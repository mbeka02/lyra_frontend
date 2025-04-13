import {
  CallContent,
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { CustomCallControls } from "~/components/CallControls";
import { Text } from "~/components/ui/text";
import { useAuthentication } from "~/providers/AuthProvider";
import { PermissionsAndroid } from "react-native";
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const { authState } = useAuthentication();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
      title: `Appointment #${id}`,
    });
  }, []);
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
    //if the call is initiated
    if (newCall) {
      setCall(newCall);
      //enable recording and transcriptions for doctor accounts
      if (authState?.user?.role === "specialist") {
        newCall.startRecording();
        newCall.startTranscription();
      }
    }
  }, [client, id]);
  useEffect(() => {
    //cleanup function (if the component unmounts if the call was not left already)
    return () => {
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);
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
        <CallContent
          layout="spotlight"
          onHangupCallHandler={() => {
            call.stopRecording();
            call.stopTranscription();
            call.leave();
          }}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
}
