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
import { Video, ArrowRight } from "lucide-react-native";
import { useAuthentication } from "~/context/AuthContext";
import { Button } from "~/components/ui/button";
import { Clock } from "~/lib/icons/Clock";
export default function HomeScreen() {
  const { authState } = useAuthentication();
  return (
    <SafeAreaView>
      <WithRole role={Role.PATIENT}>
        <ScrollView className="px-8 ">
          <View className="bg-slate-50 my-4 dark:bg-backgroundPrimary p-7 rounded-xl">
            <Text className="font-jakarta-regular text-base">
              Good morning,
            </Text>
            <Text className="font-jakarta-semibold text-lg mt-2 text-greenPrimary">
              {authState?.user?.full_name ?? "user"}
            </Text>
          </View>

          <View className="mb-4  bg-slate-50 dark:bg-backgroundPrimary shadow-sm elevation-sm p-5 rounded-xl">
            <View className="flex-row items-center mb-4">
              <Clock size={22} className="text-black dark:text-white mt-1" />
              <Text className="ml-2 font-jakarta-semibold text-lg">
                Upcoming Appointment
              </Text>
            </View>
            <View className="ml-6">
              <Text className="font-jakarta-regular text-base">
                Dr. Michael Brown
              </Text>
              <Text className="font-jakarta-bold mt-1 text-sm ">
                Cardiologist
              </Text>
              <Text className="mt-2 text-greenPrimary font-jakarta-medium ">
                2:30 PM
              </Text>
              <Button className="bg-greenPrimary my-4 flex-row gap-2 w-36 items-center justify-center">
                <Video size={20} color="#ffffff" strokeWidth={2} />
                <Text className="font-jakarta-semibold text-white  ">
                  Join Call
                </Text>
              </Button>
            </View>
          </View>

          <View className="mb-4">
            <Text className="font-jakarta-semibold text-xl mb-1">
              Quick Actions
            </Text>
            <View className="gap-4 flex-row flex-wrap">
              {[
                "Book Appointment",
                "Medical Records",
                "Prescriptions",
                "Lab Results",
              ].map((action, index) => (
                <Pressable
                  key={index}
                  className="rounded-xl shadow elevation-sm bg-slate-50 dark:bg-backgroundPrimary flex flex-row items-center justify-between min-w-[45%] px-2 p-1"
                >
                  <Text className="font-jakarta-regular text-sm">{action}</Text>
                  <ArrowRight size={20} color="#24AE7C" />
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="font-jakarta-semibold text-xl mb-1">
              Recent Activity
            </Text>
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
              <View
                key={index}
                className="bg-slate-50 dark:bg-backgroundPrimary p-4 rounded-xl mb-3"
              >
                <Text className="font-jakarta-regular text-base">
                  {activity.title}
                </Text>
                <Text className="font-jakarta-semibold text-sm mt-1">
                  {activity.doctor}
                </Text>
                <Text className="font-jakarta-medium text-xs text-secondary-foreground mt-1">
                  {activity.date}
                </Text>
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
