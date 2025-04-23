import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Video from "react-native-video";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { getCompletedAppointmentIds } from "~/services/appointments";
// Types for your recordings
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
  const [loading, setLoading] = useState<boolean>(true);
  const streamClient = useStreamVideoClient();

  useEffect(() => {
    const fetchAppointmentRecordings = async () => {
      try {
        // Fetch completed appointment IDs from the backend
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
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentRecordings();
  }, [streamClient]);

  const renderRecording = ({ item }: { item: Recording }) => {
    return (
      <View style={styles.recordingContainer}>
        <Text style={styles.recordingInfo}>Duration: {item.duration}</Text>
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
    <View style={styles.appointmentContainer}>
      <Text style={styles.appointmentTitle}>
        Appointment: {item.appointmentId}
      </Text>
      <Text style={styles.recordingsCount}>
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
    return <Text>Loading recordings...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Your Appointment Recordings</Text>
      <FlatList
        data={recordingsData}
        keyExtractor={(item) => item.appointmentId}
        renderItem={renderAppointment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  appointmentContainer: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  recordingsCount: {
    marginTop: 4,
    color: "#666",
    marginBottom: 8,
  },
  recordingContainer: {
    marginTop: 12,
  },
  recordingInfo: {
    marginBottom: 4,
  },
  videoPlayer: {
    height: 200,
    width: "100%",
    backgroundColor: "#000",
  },
});
