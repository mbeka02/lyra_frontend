/**
 * CustomCallControls.tsx
 *
 * This component provides a customized UI for video call controls.
 * It renders a styled control bar with buttons for toggling microphone,
 * switching camera, showing reactions (for non-therapists), and ending the call.
 */
import { useAuthentication } from "@/providers/AuthProvider";
import {
  CallControlProps,
  ToggleAudioPublishingButton as ToggleMic,
  ToggleCameraFaceButton,
  ReactionsButton,
  HangUpCallButton,
} from "@stream-io/video-react-native-sdk";

import { View } from "react-native";

/**
 * CustomCallControls component that renders a styled control bar for video calls
 *
 * @param props - CallControlProps from Stream Video SDK, includes handlers like onHangupCallHandler
 * @returns A styled control bar with video call control buttons
 */
export const CustomCallControls = (props: CallControlProps) => {
  // Get user role information to conditionally render controls
  const { authState } = useAuthentication();
  const isSpecialist = authState?.user?.role === "specialist";
  return (
    <View className="absolute bottom-10 py-4 w-4/5 mx-5 flex-row self-center justify-around rounded-[10px] border-5 border-green-500 bg-greenPrimary z-5">
      {/* Toggle microphone on/off */}
      <ToggleMic />
      {/* Switch between front and back camera */}
      <ToggleCameraFaceButton />
      {/* Only show reactions button for non specialist users */}
      {!isSpecialist && <ReactionsButton />}
      {/* Button to end the call */}
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
    </View>
  );
};
