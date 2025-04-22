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
import { useMutation } from "@tanstack/react-query";
import { updateAppointmentStatus } from "~/services/appointments";

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const { authState } = useAuthentication();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const router = useRouter();
  const isDoctor = authState?.user?.role === "specialist";
  const mutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: (_, variables) => {
      toast.info(`the meeting status has been updated to:${variables.status}`);
    },
  });
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
        if (isDoctor) {
          await newCall.startRecording();
          await newCall.startTranscription();
          mutation.mutate({
            status: "in_progress",
            appointment_id: parseInt(id as string),
          });
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
            if (isDoctor) {
              call.stopRecording();
              call.stopTranscription();
              mutation.mutate({
                status: "completed",
                appointment_id: parseInt(id as string),
              });
            }

            call.leave();
            router.back();
          }}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
}
