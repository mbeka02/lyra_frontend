import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react-native";

export default function AppointmentsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <CalendarIcon size={24} color="#0891b2" />
        <Text style={styles.headerTitle}>Your Appointments</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.appointmentCard}>
          <View style={styles.timeContainer}>
            <Clock size={20} color="#0891b2" />
            <Text style={styles.time}>2:30 PM</Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.doctorName}>Dr. Michael Brown</Text>
            <Text style={styles.specialty}>Cardiologist</Text>
            <Pressable style={styles.joinButton}>
              <Video size={20} color="#fff" />
              <Text style={styles.joinButtonText}>Join Video Call</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {[
          {
            doctor: "Dr. Sarah Wilson",
            specialty: "Dermatologist",
            date: "Tomorrow",
            time: "10:00 AM",
          },
          {
            doctor: "Dr. James Martin",
            specialty: "General Physician",
            date: "May 15",
            time: "3:45 PM",
          },
          {
            doctor: "Dr. Emily Chen",
            specialty: "Neurologist",
            date: "May 18",
            time: "1:15 PM",
          },
        ].map((appointment, index) => (
          <View key={index} style={styles.appointmentCard}>
            <View style={styles.timeContainer}>
              <Clock size={20} color="#0891b2" />
              <Text style={styles.time}>{appointment.time}</Text>
              <Text style={styles.date}>{appointment.date}</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.doctorName}>{appointment.doctor}</Text>
              <Text style={styles.specialty}>{appointment.specialty}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.rescheduleButton}>
                  <Text style={styles.rescheduleText}>Reschedule</Text>
                </Pressable>
                <Pressable style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.newAppointmentButton}>
        <Text style={styles.newAppointmentText}>Book New Appointment</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 20,
    color: "#0f172a",
    marginLeft: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#0f172a",
    marginBottom: 16,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  timeContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  time: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#0891b2",
    marginTop: 4,
  },
  date: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  appointmentDetails: {
    flex: 1,
  },
  doctorName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#0f172a",
  },
  specialty: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0891b2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  rescheduleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
  },
  rescheduleText: {
    fontFamily: "Inter_600SemiBold",
    color: "#0891b2",
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
  },
  cancelText: {
    fontFamily: "Inter_600SemiBold",
    color: "#ef4444",
    fontSize: 14,
  },
  newAppointmentButton: {
    margin: 16,
    backgroundColor: "#0891b2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  newAppointmentText: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    fontSize: 16,
  },
});
