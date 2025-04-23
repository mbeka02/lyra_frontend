import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import Video from "react-native-video";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { getCompletedAppointmentIds } from "~/services/appointments";
import { toast } from "sonner-native";
import { GradientText } from "~/components/GradientText";
import { SkeletonLoader } from "~/components/platform/shared/SkeletonLoader";
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

export default function RecordingsScreen() {
  const [recordingsData, setRecordingsData] = useState<AppointmentRecordings[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const streamClient = useStreamVideoClient();

  useEffect(() => {
    const fetchAppointmentRecordings = async () => {
      try {
        const appointmentIds = await getCompletedAppointmentIds();

        // Fetch recordings for each appointment
        const recordingsResults: AppointmentRecordings[] = [];

        for (const appointmentId of appointmentIds) {
          if (streamClient) {
            const IdString = appointmentId.toString();
            const call = streamClient.call("default", IdString);
            const { recordings, duration } = await call.queryRecordings();

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
        }

        setRecordingsData(recordingsResults);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
        toast.error("unable to get your meeting recordings");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentRecordings();
  }, [streamClient]);

  const renderRecording = ({ item }: { item: Recording }) => {
    return (
      <View className="mt-3">
        <Text className="font-jakarta-regular mb-1">
          Duration: {item.duration}
        </Text>
        <Video
          source={{ uri: item.url }}
          controls={true}
          style={styles.videoPlayer}
          resizeMode="contain"
        />
      </View>
    );
  };

  const renderAppointment = ({ item }: { item: AppointmentRecordings }) => (
    <View className="bg-slate-50 dark:bg-backgroundPrimary rounded-xl shadow-sm- mb-7 p-3">
      <Text className="font-jakarta-semibold text-xl">
        Appointment: {item.appointmentId}
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
      <FlatList
        data={recordingsData}
        keyExtractor={(item) => item.appointmentId}
        renderItem={renderAppointment}
      />
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
