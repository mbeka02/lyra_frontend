import React, { useState } from "react";
import { Modal, View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import UserAvatar from "../shared/UserAvatar";
import { Star, Phone, X } from "lucide-react-native";
import { Calendar } from "~/lib/icons/Calendar";
import { Users } from "~/lib/icons/Users";
import { Coins } from "~/lib/icons/Coins";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useDoctorTimeSlots } from "~/hooks/useDoctorTimeSlots";
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
  const slotDate = new Date();
  // Function to convert string back to number when needed for API calls
  const getDayAsNumber = (day: string) => parseInt(day, 10);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1  items-center fixed top-0 bg-black/50">
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
            Schedule a virtual consultation with Dr.{full_name}
          </Text>
          {/*Display availability slots*/}
          <Tabs
            className="w-full"
            value={dayOfTheWeek}
            onValueChange={setDayOfTheWeek}
          >
            <View className="px-6 pt-2 ">
              <TabsList className="flex-row justify-between mb-4">
                {days.map((day, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    className={`py-2 px-4 rounded-md ${dayOfTheWeek === index.toString() ? "bg-greenPrimary text-white" : "bg-gray-100 dark:bg-gray-800"}`}
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
          </Tabs>
        </View>
      </View>
    </Modal>
  );
}
