import { Scheduler } from "~/components/platform/doctor/Scheduler";
import { WithRole } from "~/components/WithRole";
import { Role } from "~/context/AuthContext";
import { Text } from "~/components/ui/text";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Clock, Video, ArrowRight } from "lucide-react-native";
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <WithRole role={Role.PATIENT}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Sarah Johnson</Text>
          </View>

          <View style={styles.upcomingAppointment}>
            <View style={styles.appointmentHeader}>
              <Clock size={24} color="#0891b2" />
              <Text style={styles.appointmentTitle}>Upcoming Appointment</Text>
            </View>
            <View style={styles.appointmentContent}>
              <Text style={styles.doctorName}>Dr. Michael Brown</Text>
              <Text style={styles.specialty}>Cardiologist</Text>
              <Text style={styles.time}>Today at 2:30 PM</Text>
              <Pressable style={styles.joinButton}>
                <Video size={20} color="#fff" />
                <Text style={styles.joinButtonText}>Join Video Call</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              {[
                "Book Appointment",
                "Medical Records",
                "Prescriptions",
                "Lab Results",
              ].map((action, index) => (
                <Pressable key={index} style={styles.actionCard}>
                  <Text style={styles.actionText}>{action}</Text>
                  <ArrowRight size={20} color="#64748b" />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {[
              {
                title: "Video Consultation",
                doctor: "Dr. Sarah Wilson",
                date: "Yesterday",
              },
              {
                title: "Prescription Renewed",
                doctor: "Dr. James Martin",
                date: "2 days ago",
              },
              {
                title: "Lab Results",
                doctor: "Quest Diagnostics",
                date: "1 week ago",
              },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDoctor}>{activity.doctor}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <View className="h-[90%]">
          <Scheduler />
        </View>
      </WithRole>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    backgroundColor: "#fff",
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#64748b",
  },
  name: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 24,
    marginTop: 4,
  },
  upcomingAppointment: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  appointmentTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    marginLeft: 8,
  },
  appointmentContent: {
    marginLeft: 32,
  },
  doctorName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  specialty: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#0891b2",
    marginTop: 8,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0891b2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    marginLeft: 8,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#0f172a",
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  actionText: {
    fontFamily: "Inter_500Regular",
    fontSize: 14,
    color: "#0f172a",
  },
  recentActivity: {
    padding: 16,
  },
  activityItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#0f172a",
  },
  activityDoctor: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  activityDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
});
