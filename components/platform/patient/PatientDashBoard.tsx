import { Text } from "~/components/ui/text";
import { View, ScrollView, Pressable } from "react-native";
import { Video, ArrowRight } from "lucide-react-native";
import { useAuthentication } from "~/context/AuthContext";
import { Button } from "~/components/ui/button";
import { Clock } from "~/lib/icons/Clock";
import { Href, useRouter } from "expo-router";
import { GradientText } from "~/components/GradientText";
import { useEffect, useState } from "react";
import QuickActionButton from "~/components/QuickActionButton";
import { Calendar, MessageSquare, Pill, FileText } from "lucide-react-native";
type QuickAction = {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradientColors: [string, string]; // Typed as a tuple with exactly 2 elements
  route: string;
};
function handleGreeting(): string {
  const hour = new Date().getHours();
  let greeting: string;

  if (hour >= 3 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 16) {
    greeting = "Good Afternoon";
  } else if (hour >= 16 && hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Greetings";
  }

  return greeting;
}
const QuickActionsSection = () => {
  const quickActions: QuickAction[] = [
    {
      id: "booking",
      title: "Booking",
      icon: <Calendar size={20} color="white" />,
      gradientColors: ["#6366f1", "#3b82f6"],
      route: "/search",
    },
    {
      id: "appointments",
      title: "Appointments",
      icon: <Calendar size={20} color="white" />,
      gradientColors: ["#f59e0b", "#f97316"],
      route: "/appointments",
    },
    {
      id: "prescriptions",
      title: "Prescriptions",
      icon: <Pill size={20} color="white" />,
      gradientColors: ["#10b981", "#14b8a6"],
      route: "/prescriptions",
    },
    {
      id: "records",
      title: "Records",
      icon: <FileText size={20} color="white" />,
      gradientColors: ["#a855f7", "#ec4899"],
      route: "/records",
    },
  ];

  return (
    <View className="mb-4">
      <Text className="font-jakarta-semibold text-xl mb-2 mx-2">
        Quick Actions
      </Text>

      <View className="flex-row  flex-wrap justify-between">
        {quickActions.map((action) => (
          <View
            key={action.id}
            className="w-1/2 px-2   mb-4"
            style={{ minWidth: 150 }}
          >
            <QuickActionButton
              title={action.title}
              icon={action.icon}
              gradientColors={action.gradientColors}
              route={action.route}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export function PatientDashboard() {
  const { authState } = useAuthentication();
  const greeting = handleGreeting();
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView className="px-8 ">
      <View className="bg-slate-50 my-4 dark:bg-backgroundPrimary px-7 py-4 rounded-xl ">
        <Text className="font-jakarta-bold text-2xl">{greeting},</Text>

        <GradientText
          isUnderlined={false}
          text={authState?.user?.full_name ?? "user"}
        />
        <Text className="text-sm font-jakarta-regular text-gray-500 mt-1">
          {currentTime.toLocaleDateString("en-KE", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
      <QuickActionsSection />
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
