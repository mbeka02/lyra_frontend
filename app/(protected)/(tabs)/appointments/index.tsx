import { View, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Clock, Heart } from "lucide-react-native";
import { Calendar } from "~/lib/icons/Calendar";
import { Video } from "~/lib/icons/Video";
import { AlertCircle } from "~/lib/icons/AlertCircle";
import { CheckCircle } from "~/lib/icons/CheckCircle";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { format, parseISO } from "date-fns";

import UserAvatar from "~/components/platform/shared/UserAvatar";
type AppointmentStatus =
  | "pending_payment"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";
interface Appointment {
  appointment_id: string;
  doctor_name: string;
  specialization: string;
  doctor_profile_image_url: string;
  start_time: string;
  end_time: string;
  duration?: string;
  status: AppointmentStatus;
  meetingUrl?: string;
  notes?: string;
}
export default function AppointmentsScreen() {
  const router = useRouter();
  const getStatusDetails = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return {
          label: "Upcoming",
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-700",
          borderColor: "border-indigo-200",
          icon: <Calendar className="w-4 h-4 text-indigo-700" />,
        };
      case "in_progress":
        return {
          label: "In Progress",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: <Video className="w-4 h-4 text-emerald-700" />,
        };
      case "completed":
        return {
          label: "Completed",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <CheckCircle className="w-4 h-4 text-gray-700" />,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <AlertCircle className="w-4 h-4 text-red-700" />,
        };
      default:
        return {
          label: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: null,
        };
    }
  };
  const appointments = [
    {
      appointment_id: "apt-2023-0001",
      doctor_name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      doctor_profile_image_url: "",
      start_time: "2025-04-15T09:30:00",
      end_time: "2025-04-15T10:00:00",
      duration: "30 minutes",
      status: "scheduled",
      meetingUrl: "https://meet.example.com/dr-johnson/apt-0001",
      notes: "Follow-up appointment for heart condition",
    },
    {
      appointment_id: "apt-2023-0002",
      doctor_name: "Dr. Michael Chen",
      specialization: "Dermatologist",
      doctor_profile_image_url: "",
      start_time: "2025-04-16T14:00:00",
      end_time: "2025-04-16T14:30:00",
      duration: "30 minutes",
      status: "confirmed",
      meetingUrl: "https://meet.example.com/dr-chen/apt-0002",
      notes: "Annual skin checkup",
    },
    {
      appointment_id: "apt-2023-0003",
      doctor_name: "Dr. Amanda Rodriguez",
      specialization: "Neurologist",
      doctor_profile_image_url: "",
      start_time: "2025-04-17T11:15:00",
      end_time: "2025-04-17T12:00:00",
      duration: "45 minutes",
      status: "completed",
      notes: "Headache diagnosis and treatment plan",
    },
    {
      appointment_id: "apt-2023-0004",
      doctor_name: "Dr. Robert Williams",
      specialization: "Orthopedic Surgeon",
      doctor_profile_image_url: "",
      start_time: "2025-04-20T16:30:00",
      end_time: "2025-04-20T17:00:00",
      status: "cancelled",
    },
    {
      appointment_id: "apt-2023-0005",
      doctor_name: "Dr. Emily Parker",
      specialization: "Pediatrician",
      doctor_profile_image_url: "",
      start_time: "2025-04-22T10:00:00",
      end_time: "2025-04-22T10:45:00",
      duration: "45 minutes",
      status: "pending",
      meetingUrl: "https://meet.example.com/dr-parker/apt-0005",
    },
  ];
  // Check if appointment is joinable (upcoming or in-progress)
  const isJoinable = (status: AppointmentStatus) => {
    return status === "scheduled" || status === "in_progress";
  };
  // Group appointments by date
  const groupedAppointments = appointments.reduce(
    (groups: Record<string, Appointment[]>, appointment) => {
      // Extract date from start_time
      const dateObj = parseISO(appointment.start_time);
      const formattedDate = format(dateObj, "yyyy-MM-dd");
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      const groupedAppointment: Appointment = {
        ...appointment,
        status: appointment.status as AppointmentStatus,
      };
      groups[formattedDate].push(groupedAppointment);
      return groups;
    },
    {},
  );
  // Format time from ISO string
  const formatAppointmentTime = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, MMMM d, yyyy");
  };
  return (
    <View className="h-[90%]">
      <ScrollView className="flex-1 ">
        <View className="text-2xl font-bold mb-6 text-gray-800 relative">
          <Text className="bg-clip-text text-transparent bg-gradient-to-r from-greenPrimary to-bluePrimary">
            Your Appointments
          </Text>
          <View className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-greenPrimary to-bluePrimary rounded-full"></View>
        </View>

        {Object.keys(groupedAppointments).length > 0 ? (
          Object.entries(groupedAppointments).map(
            ([date, dateAppointments]) => (
              <View key={date} className="mb-6">
                <View className="flex-row items-center mb-3">
                  <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></View>
                  <Text className="text-md font-semibold text-gray-700">
                    {formatDisplayDate(date)}
                  </Text>
                </View>

                <View className="space-y-4">
                  {dateAppointments.map((appointment: Appointment) => {
                    const statusDetails = getStatusDetails(appointment.status);

                    return (
                      <TouchableOpacity
                        key={appointment.appointment_id}
                        className={`rounded-xl overflow-hidden shadow-sm ${isJoinable(appointment.status)
                            ? "active:scale-98"
                            : ""
                          }`}
                        onPress={() => {
                          if (
                            isJoinable(appointment.status) &&
                            appointment.meetingUrl
                          ) {
                            console.log("...joining");
                          }
                        }}
                        activeOpacity={isJoinable(appointment.status) ? 0.7 : 1}
                      >
                        {/* Status indicator strip */}
                        <View
                          className={`h-1.5 w-full ${statusDetails.bgColor}`}
                        ></View>

                        <View
                          className="p-4 bg-white border-l-4 border-r border-b rounded-b-xl"
                          style={{
                            borderLeftColor:
                              appointment.status === "in_progress"
                                ? "#10b981"
                                : appointment.status === "scheduled"
                                  ? "#6366f1"
                                  : "#d1d5db",
                          }}
                        >
                          <View className="flex-row items-start gap-3">
                            {/* Doctor Avatar with specialty icon */}
                            <View className="relative">
                              <View className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                                <UserAvatar
                                  uri={appointment.doctor_profile_image_url}
                                />
                              </View>

                              {/* Specialty icon badge */}
                              <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm items-center justify-center border border-gray-100">
                                <View className="text-emerald-600">
                                  <Heart
                                    size={16}
                                    className="text-greenPrimary h-4 w-4"
                                  />
                                </View>
                              </View>
                            </View>

                            {/* Appointment Details */}
                            <View className="flex-1">
                              <Text className="font-semibold text-gray-900">
                                {appointment.doctor_name}
                              </Text>
                              <View className="flex-row items-center">
                                {appointment.specialization && (
                                  <View className="mr-1 text-emerald-600">
                                    <Heart
                                      size={16}
                                      className="text-greenPrimary h-4 w-4"
                                    />
                                  </View>
                                )}
                                <Text className="text-sm text-gray-500">
                                  {appointment.specialization}
                                </Text>
                              </View>

                              <View className="mt-2 flex-row flex-wrap items-center gap-x-4 gap-y-2">
                                <View className="flex-row items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                  <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                  <Text className="text-sm">
                                    {formatAppointmentTime(
                                      appointment.start_time,
                                      appointment.end_time,
                                    )}
                                  </Text>
                                  {appointment.duration && (
                                    <Text className="text-xs text-gray-500 ml-1">
                                      ({appointment.duration})
                                    </Text>
                                  )}
                                </View>

                                {/* Status Badge - Only show if not cancelled */}
                                {appointment.status !== "cancelled" && (
                                  <View
                                    className={`flex-row items-center gap-1 px-2 py-1 rounded-md ${statusDetails.bgColor} ${statusDetails.textColor}`}
                                  >
                                    {statusDetails.icon}
                                    <Text className="text-xs font-medium">
                                      {statusDetails.label}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          {/* Notes if available */}
                          {appointment.notes && (
                            <View className="mt-3 bg-gray-50 p-2 rounded-md border border-gray-100">
                              <Text className="text-xs text-gray-500 italic">
                                {appointment.notes}
                              </Text>
                            </View>
                          )}

                          {/* Join Meeting Button - Only for upcoming or in-progress */}
                          {isJoinable(appointment.status) &&
                            appointment.meetingUrl && (
                              <View className="mt-3 flex-row justify-end">
                                <View
                                  className={`flex-row items-center ${appointment.status === "in_progress"
                                      ? "text-emerald-600"
                                      : "text-indigo-600"
                                    } font-medium bg-gradient-to-r ${appointment.status === "in_progress"
                                      ? "from-emerald-50 to-emerald-100"
                                      : "from-indigo-50 to-indigo-100"
                                    } px-3 py-1.5 rounded-full`}
                                >
                                  <Video className="w-4 h-4 mr-1.5" />
                                  <Text className="text-sm">
                                    {appointment.status === "in_progress"
                                      ? "Join Now"
                                      : "Join Meeting"}
                                  </Text>
                                  <ArrowRight className="w-3.5 text-white h-3.5 ml-1.5" />
                                </View>
                              </View>
                            )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ),
          )
        ) : (
          <View className="items-center py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <View className="w-16 h-16 mb-4 rounded-full bg-gray-200 items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </View>
            <Text className="text-lg font-medium text-gray-700 mb-1">
              No Appointments
            </Text>
            <Text className="text-gray-500 text-center max-w-xs px-4">
              You don't have any appointments scheduled at the moment.
            </Text>
            <TouchableOpacity className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
              <Text className="text-white font-medium text-sm">
                Book an Appointment
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="p-4">
          <Text className="font-jakarta-semibold text-lg  mb-4">Today</Text>
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
          className="m-4 bg-greenPrimary p-4 rounded-xl items-center"
        >
          <Text className="font-jakarta-semibold text-white text-base">
            Book New Appointment
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
