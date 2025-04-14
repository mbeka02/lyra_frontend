// import {
//   CallContent,
//   Call,
//   CallingState,
//   StreamCall,
//   useStreamVideoClient,
// } from "@stream-io/video-react-native-sdk";
// import { useLocalSearchParams, useNavigation } from "expo-router";
// import { useEffect, useState } from "react";
// import { View } from "react-native";
// import { CustomCallControls } from "~/components/CallControls";
// import { Text } from "~/components/ui/text";
// import { useAuthentication } from "~/providers/AuthProvider";
// import { PermissionsAndroid } from "react-native";
// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
// export default function VideoCallScreen() {
//   const { id } = useLocalSearchParams();
//   const { authState } = useAuthentication();
//   const client = useStreamVideoClient();
//   const [call, setCall] = useState<Call | null>(null);
//   const navigation = useNavigation();
//   useEffect(() => {
//     navigation.setOptions({
//       headerBackTitle: "Back",
//       title: `Appointment #${id}`,
//     });
//   }, []);
//   //initiate call
//   useEffect(() => {
//     const handleCall = () => {
//       try {
//         //creates a new call
//         const newCall = client?.call("default", id as string);
//         /**
//          * Will start to watch for call related WebSocket events and initiate a call session with the server.
//          *
//          * @returns a promise which resolves once the call join-flow has finished.
//          */
//
//         call?.join(
//           //if true the call will be created if it doesn't exist
//           { create: true },
//         );
//         //if the call is initiated
//         if (newCall) {
//           console.log("...the call has been initiated");
//           setCall(newCall);
//           //enable recording and transcriptions for doctor accounts
//           if (authState?.user?.role === "specialist") {
//             newCall.startRecording();
//             newCall.startTranscription();
//           }
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     handleCall();
//   }, [client, id]);
//   useEffect(() => {
//     //cleanup function (if the component unmounts if the call was not left already)
//     return () => {
//       if (call?.state.callingState !== CallingState.LEFT) {
//         call?.leave();
//       }
//     };
//   }, [call]);
//   if (!call) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text>...the session details are loading</Text>
//       </View>
//     );
//   }
//   return (
//     <StreamCall call={call}>
//       <View className="flex-1 border-solid border-white border-2">
//         <CallContent
//           layout="spotlight"
//           onHangupCallHandler={() => {
//             call.stopRecording();
//             call.stopTranscription();
//             call.leave();
//           }}
//           CallControls={CustomCallControls}
//         />
//       </View>
//     </StreamCall>
//   );
// }
import {
  CallContent,
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { CustomCallControls } from "~/components/CallControls";
import { Text } from "~/components/ui/text";
import { useAuthentication } from "~/providers/AuthProvider";
import { PermissionsAndroid } from "react-native";
import { toast } from "sonner-native";

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const { authState } = useAuthentication();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
      title: `Appointment #${id}`,
    });
  }, []);

  // Request permissions first
  useEffect(() => {
    async function requestPermissions() {
      try {
        if (Platform.OS === "android") {
          const cameraGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          const microphoneGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          const notificationsGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (
            cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
            microphoneGranted === PermissionsAndroid.RESULTS.GRANTED
          ) {
            setPermissionsGranted(true);
            console.log("Camera and microphone permissions granted");
          } else {
            toast.warning(
              "Permissions Required:Camera and microphone permissions are required for video calls",
            );
          }
        }
      } catch (error) {
        console.error("Error requesting permissions:", error);
      }
    }

    requestPermissions();
  }, []);

  // Initialize call after permissions are granted
  useEffect(() => {
    const handleCall = async () => {
      if (!client || !permissionsGranted) return;

      try {
        console.log("Creating new call for id:", id);
        const newCall = client.call("default", id as string);

        // Set the call in state first
        setCall(newCall);

        // Now join the call with the newly created call object
        await newCall.join({ create: true });

        console.log("Call joined successfully");

        // Enable recording and transcriptions for doctor accounts
        if (authState?.user?.role === "specialist") {
          await newCall.startRecording();
          await newCall.startTranscription();
        }
      } catch (error) {
        console.error("Error creating or joining call:", error);
      }
    };

    if (client && permissionsGranted) {
      handleCall();
    }
  }, [client, id, permissionsGranted]);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (call?.state.callingState !== CallingState.LEFT) {
        console.log("Leaving call due to component unmount");
        call?.leave();
      }
    };
  }, [call]);

  if (!permissionsGranted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Waiting for camera and microphone permissions...</Text>
      </View>
    );
  }

  if (!call) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>...the session details are loading</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View className="flex-1">
        <CallContent
          layout="spotlight"
          onHangupCallHandler={() => {
            if (authState?.user?.role === "specialist") {
              call.stopRecording();
              call.stopTranscription();
            }
            call.leave();
          }}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
}
