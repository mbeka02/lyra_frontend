import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Calendar } from "lucide-react-native";
import { parseISO, format } from "date-fns";
import { Href, useRouter } from "expo-router";
import { AppointmentCard } from "./AppointmentCard";
import { GradientText } from "~/components/GradientText";
import { SkeletonLoader } from "~/components/platform/shared/SkeletonLoader";
import { Appointment } from "~/services/types";

type AppointmentsListProps<T extends Appointment> = {
  appointments: T[] | undefined;
  title: string;
  isLoading: boolean;
  isError: boolean;
  emptyStateMessage?: string;
  viewType: "patient" | "specialist";
  newAppointmentRoute?: string;
};

export function AppointmentsList<T extends Appointment>({
  appointments,
  title,
  isLoading,
  isError,
  emptyStateMessage = "You don't have any appointments scheduled at the moment.",
  viewType,
  newAppointmentRoute = "/search",
}: AppointmentsListProps<T>) {
  const router = useRouter();

  // Group appointments by date
  const groupedAppointments = appointments?.reduce(
    (groups: Record<string, T[]>, appointment) => {
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

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, MMMM d, yyyy");
  };

  if (isLoading)
    return (
      <SkeletonLoader
        count={3}
        containerStyles="gap-4 py-2 px-6"
        skeletonStlyes="rounded-xl px-4 p-2 w-full h-32"
      />
    );

  if (isError) {
    return (
      <View className="h-full">
        <Text className="font-jakarta-semibold text-xl mx-auto my-auto text-red-600">
          Error: Unable to load page info
        </Text>
      </View>
    );
  }

  return (
    <View className="h-full">
      <ScrollView className="flex-1">
        <View className="mb-6 mx-6 mt-4">
          <GradientText isUnderlined={true} text={title} />
        </View>
        {groupedAppointments && Object.keys(groupedAppointments).length > 0 ? (
          Object.entries(groupedAppointments).map(
            ([date, dateAppointments]) => (
              <View key={date} className="mb-6 mx-6">
                <View className="flex-row items-center mb-3">
                  <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></View>
                  <Text className="text-sm font-jakarta-regular">
                    {formatDisplayDate(date)}
                  </Text>
                </View>

                <View className="space-y-4">
                  {dateAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.appointment_id}
                      appointment={appointment}
                      viewType={viewType}
                    />
                  ))}
                </View>
              </View>
            ),
          )
        ) : (
          <View className="items-center py-12">
            <View className="w-16 h-16 mb-4 rounded-full bg-greenPrimary items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </View>
            <Text className="text-lg font-jakarta-medium mb-1">
              No Appointments
            </Text>
            <Text className="text-gray-500 font-jakarta-regular text-center max-w-xs px-4">
              {emptyStateMessage}
            </Text>
          </View>
        )}
        <Pressable
          onPress={() => router.push(newAppointmentRoute as Href)}
          className="m-4 mx-6 bg-greenPrimary p-4 rounded-xl items-center"
        >
          <Text className="font-jakarta-semibold text-white text-base">
            {viewType === "patient"
              ? "Book New Appointment"
              : "Update Your Schedule"}
          </Text>
        </Pressable>
        )
      </ScrollView>
    </View>
  );
}
