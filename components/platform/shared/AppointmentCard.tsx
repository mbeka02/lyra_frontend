import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Calendar } from "~/lib/icons/Calendar";
import { Video } from "~/lib/icons/Video";
import { AlertCircle } from "~/lib/icons/AlertCircle";
import { CheckCircle } from "~/lib/icons/CheckCircle";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { FlipVertical2 } from "~/lib/icons/FlipVerical2";
import { Heart } from "~/lib/icons/Heart";
import { Clock } from "~/lib/icons/Clock";

import { parseISO, format } from "date-fns";
import UserAvatar from "~/components/platform/shared/UserAvatar";
import { Href, useRouter } from "expo-router";
import {
  Appointment,
  AppointmentStatus,
  isPatientAppointment,
  isDoctorAppointment,
} from "~/services/types";

interface AppointmentCardProps {
  appointment: Appointment;
  viewType: "specialist" | "patient";
}

export function AppointmentCard({
  appointment,
  viewType,
}: AppointmentCardProps) {
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

  const isJoinable = (status: AppointmentStatus) => {
    return status === "scheduled" || status === "in_progress";
  };

  const formatAppointmentTime = (startTime: string) => {
    const start = parseISO(startTime);
    // const end = parseISO(endTime);
    // return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;

    return `${format(start, "h:mm a")}`;
  };

  const statusDetails = getStatusDetails(appointment.current_status);

  // Determine the name and profile image based on the view type and appointment type
  let personName = "";
  let profileImageUrl = "";
  let specialization = "";

  if (viewType === "patient" && isPatientAppointment(appointment)) {
    personName = appointment.doctor_name;
    profileImageUrl = appointment.doctor_profile_image_url;
    specialization = appointment.specialization;
  } else if (viewType === "specialist" && isDoctorAppointment(appointment)) {
    personName = appointment.patient_name;
    profileImageUrl = appointment.patient_profile_image_url;
  }

  return (
    <TouchableOpacity
      key={appointment.appointment_id}
      className={`rounded-xl mb-4 overflow-hidden shadow-sm ${isJoinable(appointment.current_status) ? "active:scale-98" : ""
        }`}
      onPress={() => {
        if (isJoinable(appointment.current_status)) {
          router.push(`/appointments/${appointment.appointment_id}` as Href);
        }
      }}
      activeOpacity={isJoinable(appointment.current_status) ? 0.7 : 1}
    >
      {/* Status indicator strip */}
      <View className={`h-1.5 w-full ${statusDetails.stripColor}`}></View>

      <View className="p-4 dark:bg-backgroundPrimary bg-slate-50 rounded-b-xl">
        <View className="flex-row items-start gap-3">
          {/* Person Avatar with role icon */}
          <View className="relative">
            <View className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden shadow-sm">
              <UserAvatar uri={profileImageUrl} size={70} />
            </View>

            {/* Role icon badge */}
            {viewType === "patient" && (
              <View
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${statusDetails.bgColor} shadow-sm items-center justify-center border border-gray-100`}
              >
                <Heart
                  size={14}
                  strokeWidth={2}
                  className={`${statusDetails.textColor} h-4 w-4`}
                />
              </View>
            )}
          </View>

          {/* Appointment Details */}
          <View className="flex-1">
            <Text className="font-jakarta-regular text-lg">{personName}</Text>

            {viewType === "patient" && specialization && (
              <View className="flex-row items-center">
                <Text className="text-xs font-jakarta-regular">
                  {specialization}
                </Text>
              </View>
            )}

            <View className="mt-2 flex-row flex-wrap items-center gap-x-2 gap-y-2">
              <View className="flex-row items-center py-1 rounded-md">
                <Clock
                  size={16}
                  className={`w-2 h-2 mr-2 ${statusDetails.textColor}`}
                />
                <Text className="font-jakarta-regular text-xs">
                  {formatAppointmentTime(appointment.start_time)}
                </Text>
              </View>

              {/* Status Badge*/}
              <View
                className={`flex-row items-center gap-1 p-1 rounded-md ${statusDetails.bgColor}`}
              >
                {statusDetails.icon}
                <Text
                  className={`text-xs ${statusDetails.textColor} font-jakarta-semibold`}
                >
                  {statusDetails.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes if available */}
        {appointment.notes.Valid && (
          <View className="mt-3 bg-slate-100 dark:bg-black/10 p-2 rounded-md">
            <Text className="text-xs font-jakarta-regular italic">
              {appointment.notes.String}
            </Text>
          </View>
        )}

        {/* Join Meeting Button - Only for upcoming or in-progress */}
        {isJoinable(appointment.current_status) && (
          <View className="mt-3 flex-row justify-end">
            <View
              className={`flex-row items-center px-3 py-1.5 rounded-full ${statusDetails.bgColor}`}
            >
              <Video className={`w-4 h-4 mr-1.5 ${statusDetails.textColor}`} />
              <Text
                className={`text-sm font-jakarta-semibold ${statusDetails.textColor}`}
              >
                {appointment.current_status === "in_progress"
                  ? "Join Now"
                  : "Join Meeting"}
              </Text>
              <ArrowRight className="hidden w-3.5 text-black dark:text-white h-3.5 ml-1.5" />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
