import { Text } from "~/components/ui/text";
import { View, ScrollView, Pressable } from "react-native";
import { Video, ArrowRight } from "lucide-react-native";
import { useAuthentication } from "~/context/AuthContext";
import { Button } from "~/components/ui/button";
import { Clock } from "~/lib/icons/Clock";
import { Href, useRouter } from "expo-router";
import { GradientText } from "~/components/GradientText";
import { useEffect, useState } from "react";

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
export function PatientDashboard() {
  const { authState } = useAuthentication();
  const greeting = handleGreeting();
  const [currentTime, setCurrentTime] = useState(new Date());
  const actions = [
    {
      name: "Book Appointment",
      link: "/search",
    },
    {
      name: "View Appointments",
      link: "/appointments",
    },
    {
      name: "Medical Records",
      link: "/records",
    },
    {
      name: "Prescriptions",
      link: "/prescriptions",
    },
    {
      name: "Profile",
      link: "/settings/profile",
    },
    {
      name: "Settings",
      link: "/settings",
    },
  ];
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
          {actions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(action.link as Href)}
              className="rounded-md shadow elevation-sm bg-slate-50 dark:bg-backgroundPrimary flex flex-row items-center justify-between min-w-[45%] px-2 p-1"
            >
              <Text className="font-jakarta-regular text-sm">
                {action.name}
              </Text>
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
