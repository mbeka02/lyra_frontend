import { View, ScrollView, Pressable } from "react-native";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export default function AppointmentsScreen() {
  const router = useRouter();
  return (
    <View className="h-[90%]">
      <ScrollView className="flex-1 ">
        <View className="flex-row items-center p-6 bg-white border-b border-slate-200">
          <CalendarIcon size={24} color="#24AE7C" />
          <Text className="font-jakarta-semibold text-xl  ml-3">
            Your Appointments
          </Text>
        </View>

        <View className="p-4">
          <Text className="font-jakarta-semibold text-lg text-slate-900 mb-4">
            Today
          </Text>
          <View className="bg-slate-50 dark:bg-backgroundPrimary rounded-xl p-5 mb-4 flex-row shadow-sm">
            <View className="items-center mr-5">
              <Clock size={20} color="#24AE7C" />
              <Text className="font-jakarta-semibold text-sm text-greenPrimary mt-1">
                2:30 PM
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-jakarta-regular text-base ">
                Dr. Michael Brown
              </Text>
              <Text className="text-sm font-jakarta-bold mt-0.5">
                Cardiologist
              </Text>
              <Button className="bg-greenPrimary my-4 flex-row gap-2 w-36 items-center justify-center">
                <Video size={20} color="#ffffff" strokeWidth={2} />
                <Text className="font-jakarta-semibold text-white  ">
                  Join Call
                </Text>
              </Button>
            </View>
          </View>
        </View>

        <View className="p-4">
          <Text className="font-jakarta-semibold text-lg  mb-4">Upcoming</Text>
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
            <View
              key={index}
              className="bg-slate-50 dark:bg-backgroundPrimary rounded-xl p-5 mb-4 flex-row shadow-sm"
            >
              <View className="items-center mr-5">
                <Clock size={20} color="#24AE7C" />
                <Text className="font-jakarta-semibold text-sm text-greenPrimary mt-1">
                  {appointment.time}
                </Text>
                <Text className="text-xs font-jakarta-regular  mt-0.5">
                  {appointment.date}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-jakarta-regular text-base">
                  {appointment.doctor}
                </Text>
                <Text className="text-sm font-jakarta-bold mt-0.5">
                  {appointment.specialty}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push("/search")}
          className="m-4 bg-backgroundPrimary p-4 rounded-xl items-center"
        >
          <Text className="font-jakarta-semibold text-white text-base">
            Book New Appointment
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
