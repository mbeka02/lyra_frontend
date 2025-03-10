import React, { useState } from "react";
import { Modal, View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react-native";
import { Calendar } from "~/lib/icons/Calendar";
import { Clock } from "~/lib/icons/Clock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useDoctorTimeSlots } from "~/hooks/useDoctorTimeSlots";
import { SkeletonLoader } from "../shared/SkeletonLoader";
import { getDateForDayOfWeek } from "~/utils/dates";

const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

interface DoctorDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  doctor: {
    full_name: string;
    description: string;
    specialization: string;
    profile_image_url: string;
    years_of_experience: number;
    price_per_hour: string;
    county: string;
    doctor_id: number;
  };
}

export function AppointmentModal({
  isVisible,
  onClose,
  doctor,
}: DoctorDetailsModalProps) {
  const {
    full_name,
    description,
    specialization,
    profile_image_url,
    years_of_experience,
    price_per_hour,
    county,
    doctor_id,
  } = doctor;
  const [dayOfTheWeek, setDayOfTheWeek] = useState("0");

  // Function to convert string back to number when needed for API calls
  const getDayAsNumber = (day: string) => parseInt(day, 10);

  const { data: timeSlots, isLoading } = useDoctorTimeSlots(
    getDayAsNumber(dayOfTheWeek),
    doctor_id,
    getDateForDayOfWeek(getDayAsNumber(dayOfTheWeek), true),
  );

  if (!isVisible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center bg-black/50">
        <View className="w-11/12 mt-24 bg-slate-50 dark:bg-backgroundPrimary rounded-xl p-6 max-h-5/6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-4 items-center">
              <Calendar
                className="h-3 w-3 text-black dark:text-white"
                strokeWidth={2.5}
              />
              <Text className="font-jakarta-semibold text-xl">
                Book Appointment
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={20} className="text-red-600" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text className="font-jakarta-regular mb-2 text-sm text-muted-foreground">
            Schedule a virtual consultation with Dr. {full_name}
          </Text>

          {/* Display availability slots */}
          <Tabs
            className="w-full"
            value={dayOfTheWeek}
            onValueChange={setDayOfTheWeek}
          >
            <View className="pt-2">
              <TabsList className="flex-row bg-transparent flex-wrap gap-2 mb-12">
                {days.map((day, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    className={`py-2 px-1 rounded-md ${dayOfTheWeek === index.toString() ? "bg-greenPrimary text-white" : "bg-gray-100 dark:bg-gray-800"}`}
                  >
                    <Text
                      className={`text-sm font-jakarta-medium ${dayOfTheWeek === index.toString() ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {day}
                    </Text>
                  </TabsTrigger>
                ))}
              </TabsList>
            </View>

            {/* Now each day has its own TabsContent */}
            {days.map((day, index) => (
              <TabsContent key={index} value={index.toString()}>
                <View className="flex-row gap-1 items-center mb-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <Text className="font-jakarta-regular text-muted-foreground text-sm">
                    Available time slots for {day}
                  </Text>
                </View>

                {isLoading ? (
                  <SkeletonLoader
                    count={2}
                    containerStyles="gap-3 py-2 px-4"
                    skeletonStlyes="rounded-3xl px-4 p-2 w-full h-20"
                  />
                ) : timeSlots && timeSlots.length > 0 ? (
                  <View className="px-1 flex-row flex-wrap gap-2">
                    {timeSlots.map((timeslot, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        disabled={timeslot.slot_status === "booked"}
                        variant="outline"
                      >
                        <Text className="font-jakarta-medium text-xs">
                          {timeslot.slot_start_time}-{timeslot.slot_end_time}
                        </Text>
                      </Button>
                    ))}
                  </View>
                ) : (
                  <View className="py-4 items-center">
                    <Text className="text-muted-foreground">
                      No time slots available for this day
                    </Text>
                  </View>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </View>
      </View>
    </Modal>
  );
}
