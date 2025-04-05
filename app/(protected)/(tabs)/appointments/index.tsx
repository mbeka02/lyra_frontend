import { View, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Calendar } from "~/lib/icons/Calendar";
import { Video } from "~/lib/icons/Video";
import { AlertCircle } from "~/lib/icons/AlertCircle";
import { CheckCircle } from "~/lib/icons/CheckCircle";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { FlipVertical2 } from "~/lib/icons/FlipVerical2";
import { Heart } from "~/lib/icons/Heart";
import { Clock } from "~/lib/icons/Clock";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
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
          borderColor: "border-indigo-500",
          stripColor: "bg-indigo-700",
          icon: <Calendar size={14} className="w-4 h-4 text-indigo-700" />,
        };
      case "in_progress":
        return {
          label: "In Progress",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-500",
          stripColor: "bg-emerald-700",
          icon: <Video size={14} className="w-4 h-4 text-emerald-700" />,
        };
      case "completed":
        return {
          label: "Completed",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-500",
          stripColor: "bg-gray-700",
          icon: <CheckCircle size={14} className="w-4 h-4 text-gray-700" />,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-500",
          stripColor: "bg-red-700",
          icon: <AlertCircle size={14} className="w-4 h-4 text-red-700" />,
        };
      default:
        return {
          label: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-400",
          stripColor: "bg-gray-700",
          icon: <FlipVertical2 size={14} className="w-4 h-4 text-gray-700" />,
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
              <View key={date} className="mb-6 mx-8">
                <View className="flex-row items-center mb-3">
                  <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></View>
                  <Text className="text-sm font-jakarta-regular ">
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
                          className={`h-1.5 w-full ${statusDetails.stripColor}`}
                        ></View>

                        <View className="p-4 dark:bg-backgroundPrimary bg-slate-50   rounded-b-xl">
                          <View className="flex-row items-start gap-3">
                            {/* Doctor Avatar with specialty icon */}
                            <View className="relative">
                              <View className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden  shadow-sm">
                                <UserAvatar
                                  uri={appointment.doctor_profile_image_url}
                                />
                              </View>

                              {/* Specialty icon badge */}
                              <View
                                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${statusDetails.bgColor} shadow-sm items-center justify-center border border-gray-100`}
                              >
                                <Heart
                                  size={14}
                                  strokeWidth={2}
                                  className={`${statusDetails.textColor} h-4 w-4`}
                                />
                              </View>
                            </View>

                            {/* Appointment Details */}
                            <View className="flex-1">
                              <Text className="font-jakarta-regular">
                                {appointment.doctor_name}
                              </Text>
                              <View className="flex-row items-center">
                                <Text className="text-sm font-jakarta-semibold">
                                  {appointment.specialization}
                                </Text>
                              </View>

                              <View className="mt-2 flex-row flex-wrap items-center gap-x-2 gap-y-2">
                                <View className="flex-row items-center   py-1 rounded-md">
                                  <Clock
                                    size={18}
                                    className={`w-2 h-2  mr-2  ${statusDetails.textColor} `}
                                  />
                                  <Text className=" font-jakarta-regular text-xs">
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

                                {/* Status Badge*/}
                                {
                                  <View
                                    className={`flex-row items-center gap-1 p-1 rounded-md ${statusDetails.bgColor}`}
                                  >
                                    {statusDetails.icon}
                                    <Text
                                      className={`text-xs  ${statusDetails.textColor} font-jakarta-semibold`}
                                    >
                                      {statusDetails.label}
                                    </Text>
                                  </View>
                                }
                              </View>
                            </View>
                          </View>

                          {/* Notes if available */}
                          {appointment.notes && (
                            <View className="mt-3 bg-slate-100 dark:bg-black/10 p-2 rounded-md ">
                              <Text className="text-xs font-jakarta-regular italic">
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
                                  <ArrowRight className="w-3.5 text-black dark:text-white h-3.5 ml-1.5" />
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
          </View>
        )}
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
