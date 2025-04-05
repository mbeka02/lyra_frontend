import { Text } from "~/components/ui/text";
import { View, ScrollView, Pressable } from "react-native";
import { Video, ArrowRight } from "lucide-react-native";
import { useAuthentication } from "~/context/AuthContext";
import { Button } from "~/components/ui/button";
import { Clock } from "~/lib/icons/Clock";

function handleGreeting(): string {
  const hour = new Date().getHours();
  let greeting: string;

  if (hour >= 3 && hour < 12) {
    greeting = "☀️  Good Morning";
  } else if (hour >= 12 && hour < 16) {
    greeting = "🌤️ Good Afternoon";
  } else if (hour >= 16 && hour < 21) {
    greeting = "🌆 Good Evening";
  } else {
    greeting = "🌙 It's getting late";
  }

  return greeting;
}
export function PatientDashboard() {
  const { authState } = useAuthentication();
  const greeting = handleGreeting();
  return (
    <ScrollView className="px-8 ">
      <View className="bg-slate-50 my-4 dark:bg-backgroundPrimary p-7 rounded-xl">
        <Text className="font-jakarta-regular text-base">{greeting}</Text>
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
          <Text className="font-jakarta-bold mt-1 text-sm ">Cardiologist</Text>
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
  );
}
