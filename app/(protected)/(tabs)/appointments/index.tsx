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
import { AppointmentStatus, PatientAppointment } from "~/services/types";
import UserAvatar from "~/components/platform/shared/UserAvatar";
import { useQuery } from "@tanstack/react-query";
import { getPatientAppointments } from "~/services/appointments";
import { useState } from "react";
/*
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
}*/
export default function AppointmentsScreen() {
  const router = useRouter();
  const [interval, setInterval] = useState(21);
  const [status, setStatus] = useState("");
  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: () => getPatientAppointments(status, interval),
    refetchInterval: 12000,
  });
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
  const isJoinable = (status: AppointmentStatus) => {
    return status === "scheduled" || status === "in_progress";
  };
  // Group appointments by date
  const groupedAppointments = appointments?.reduce(
    (groups: Record<string, PatientAppointment[]>, appointment) => {
      // Extract date from start_time
      const dateObj = parseISO(appointment.start_time);
      const formattedDate = format(dateObj, "yyyy-MM-dd");
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }

      groups[formattedDate].push(appointment);
      return groups;
    },
    {},
  );

  // Format time from ISO string
  const formatAppointmentTime = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    // return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
    return `${format(start, "h:mm a")}`;
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

        {groupedAppointments && Object.keys(groupedAppointments).length > 0 ? (
          Object.entries(groupedAppointments).map(
            ([date, dateAppointments]) => (
              <View key={date} className="mb-6 mx-6 ">
                <View className="flex-row items-center mb-3">
                  <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></View>
                  <Text className="text-sm font-jakarta-regular ">
                    {formatDisplayDate(date)}
                  </Text>
                </View>

                <View className="space-y-4">
                  {dateAppointments.map((appointment: PatientAppointment) => {
                    const statusDetails = getStatusDetails(
                      appointment.current_status,
                    );

                    return (
                      <TouchableOpacity
                        key={appointment.appointment_id}
                        className={`rounded-xl mb-4 overflow-hidden shadow-sm ${isJoinable(appointment.current_status)
                            ? "active:scale-98"
                            : ""
                          }`}
                        onPress={() => {
                          if (isJoinable(appointment.current_status)) {
                            console.log("...joining");
                          }
                        }}
                        activeOpacity={
                          isJoinable(appointment.current_status) ? 0.7 : 1
                        }
                      >
                        {/* Status indicator strip */}
                        <View
                          className={`h-1.5 w-full ${statusDetails.stripColor}`}
                        ></View>

                        <View className="p-4 dark:bg-backgroundPrimary bg-slate-50   rounded-b-xl">
                          <View className="flex-row items-start gap-3">
                            {/* Doctor Avatar with specialty icon */}
                            <View className="relative">
                              <View className="w-20 h-20  rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden  shadow-sm">
                                <UserAvatar
                                  uri={appointment.doctor_profile_image_url}
                                  size={70}
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
                              <Text className="font-jakarta-regular text-lg">
                                {appointment.doctor_name}
                              </Text>
                              <View className="flex-row items-center">
                                <Text className="text-xs font-jakarta-regular">
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
                          {appointment.notes.Valid && (
                            <View className="mt-3 bg-slate-100 dark:bg-black/10 p-2 rounded-md ">
                              <Text className="text-xs font-jakarta-regular italic">
                                {appointment.notes.String}
                              </Text>
                            </View>
                          )}

                          {/* Join Meeting Button - Only for upcoming or in-progress */}
                          {isJoinable(appointment.current_status) && (
                            <View className="mt-3 flex-row justify-end">
                              <View
                                className={`flex-row items-center ${appointment.current_status === "in_progress"
                                    ? "text-emerald-600"
                                    : "text-indigo-600"
                                  } font-medium bg-gradient-to-r ${appointment.current_status === "in_progress"
                                    ? "from-emerald-50 to-emerald-100"
                                    : "from-indigo-50 to-indigo-100"
                                  } px-3 py-1.5 rounded-full`}
                              >
                                <Video className="w-4 h-4 mr-1.5" />
                                <Text className="text-sm">
                                  {appointment.current_status === "in_progress"
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
          <View className="items-center py-12">
            <View className="w-16 h-16 mb-4 rounded-full bg-greenPrimary items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </View>
            <Text className="text-lg font-jakarta-medium  mb-1">
              No Appointments
            </Text>
            <Text className="text-gray-500 font-jakarta-regular text-center max-w-xs px-4">
              You don't have any appointments scheduled at the moment.
            </Text>
          </View>
        )}
        <Pressable
          onPress={() => router.push("/search")}
          className="m-4 mx-6 bg-greenPrimary p-4 rounded-xl items-center"
        >
          <Text className="font-jakarta-semibold text-white text-base">
            Book New Appointment
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
