import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { ResizeMode, Video } from "expo-av"; // Correct import for Expo's Video component
import { Video as VideoIcon } from "@/lib/icons/Video";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { getCompletedAppointmentIds } from "~/services/appointments";
import { toast } from "sonner-native";
import { GradientText } from "~/components/GradientText";
import { SkeletonLoader } from "~/components/platform/shared/SkeletonLoader";
import { differenceInSeconds } from "date-fns";
interface Recording {
  id: string;
  url: string;
  startedAt: string;
  endedAt: string;
  filename: string;
  duration: string;
}

interface AppointmentRecordings {
  appointmentId: string;
  recordings: Recording[];
}

interface VideoErrorState {
  [key: string]: boolean;
}

export default function RecordingsScreen() {
  const [recordingsData, setRecordingsData] = useState<AppointmentRecordings[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [videoErrors, setVideoErrors] = useState<VideoErrorState>({});
  const streamClient = useStreamVideoClient();

  useEffect(() => {
    const fetchAppointmentRecordings = async () => {
      try {
        const appointmentIds = await getCompletedAppointmentIds();

        // Fetch recordings for each appointment
        const recordingsResults: AppointmentRecordings[] = [];

        // Safety check, ensure the ids exist and that the length > 0
        if (appointmentIds && appointmentIds.length > 0) {
          for (const appointmentId of appointmentIds) {
            if (streamClient) {
              try {
                const IdString = appointmentId.toString();
                const call = streamClient.call("default", IdString);
                const { recordings, duration } = await call.queryRecordings();

                if (recordings && recordings.length > 0) {
                  recordingsResults.push({
                    appointmentId: IdString,
                    recordings: recordings.map((rec) => ({
                      id: rec.session_id,
                      url: rec.url,
                      duration,
                      startedAt: rec.start_time,
                      endedAt: rec.end_time,
                      filename: rec.filename,
                    })),
                  });
                }
              } catch (error) {
                console.error(
                  `Error fetching recordings for appointment ${appointmentId}:`,
                  error,
                );
              }
            }
          }
        }

        setRecordingsData(recordingsResults);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
        toast.error("Unable to get your meeting recordings");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentRecordings();
  }, [streamClient]);

  const handleVideoError = (error: any, recordingId: string) => {
    console.error(`Error playing video ${recordingId}:`, error);
    setVideoErrors((prev) => ({
      ...prev,
      [recordingId]: true,
    }));

    const errorMessage =
      error && error.error ? error.error.toString() : "Unknown error";
    toast.error(`Error playing video: ${errorMessage}`);
  };

  const renderRecording = ({ item }: { item: Recording }) => {
    if (videoErrors[item.id]) {
      return (
        <View className="mt-3 bg-red-50 p-4 rounded-lg">
          <Text className="font-jakarta-medium text-red-600">
            Failed to load video. The recording might be unavailable.
          </Text>
          <Text className="font-jakarta-regular text-xs text-gray-600 mt-1">
            Duration: {differenceInSeconds(item.endedAt, item.startedAt)}{" "}
            seconds
          </Text>
        </View>
      );
    }

    return (
      <View className="mt-3">
        <Text className="font-jakarta-regular mb-1 text-xs">
          Duration: {differenceInSeconds(item.endedAt, item.startedAt)} seconds
        </Text>
        <Video
          source={{ uri: item.url }}
          style={styles.videoPlayer}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          onError={(error) => handleVideoError(error, item.id)}
          onLoadStart={() => console.log(`Loading video: ${item.id}`)}
          onLoad={() => console.log(`Video loaded: ${item.id}`)}
          shouldPlay={false}
        />
      </View>
    );
  };

  const renderAppointment = ({ item }: { item: AppointmentRecordings }) => (
    <View className="bg-slate-50 dark:bg-backgroundPrimary rounded-xl shadow-sm my-6 p-3">
      <Text className="font-jakarta-semibold text-xl">
        Appointment: #{item.appointmentId}
      </Text>
      <Text className="mt-1 mb-2">
        {item.recordings.length} recording
        {item.recordings.length !== 1 ? "s" : ""}
      </Text>
      <FlatList
        data={item.recordings}
        keyExtractor={(recording) => recording.id}
        renderItem={renderRecording}
      />
    </View>
  );

  if (loading) {
    return (
      <SkeletonLoader
        count={5}
        containerStyles="gap-4 py-2 px-6"
        skeletonStlyes="rounded-xl px-4 p-2 w-full h-28"
      />
    );
  }

  return (
    <View className="flex-1 py-2 px-6">
      <GradientText isUnderlined={true} text="Your Session Recordings" />
      {recordingsData && (
        <FlatList
          data={recordingsData}
          keyExtractor={(item) => item.appointmentId}
          renderItem={renderAppointment}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center py-12">
              <View className="w-16 h-16 mb-4 rounded-full bg-greenPrimary items-center justify-center">
                <VideoIcon className="w-8 h-8 text-white" />
              </View>
              <Text className="text-lg font-jakarta-medium mb-1">
                No Recordings
              </Text>
              <Text className="text-gray-500 font-jakarta-regular text-center max-w-xs px-4">
                Looks like you have no recordings of past sessions.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  videoPlayer: {
    height: 200,
    width: "100%",
    backgroundColor: "#000",
  },
});
