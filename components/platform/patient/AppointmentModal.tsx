import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react-native";
import { Calendar } from "~/lib/icons/Calendar";
import { Clock } from "~/lib/icons/Clock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useDoctorTimeSlots } from "~/hooks/useDoctorTimeSlots";
import { SkeletonLoader } from "../shared/SkeletonLoader";
import { getDateForDayOfWeek } from "~/utils/dates";
import { useMemo } from "react";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { toast } from "sonner-native";
import { useBookAppointment } from "~/hooks/useBookAppointment";
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
  const [reason, setReason] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    slot_id: number;
    slot_start_time: string;
    slot_end_time: string;
  } | null>(null);
  // Function to convert string back to number when needed for API calls
  const getDayAsNumber = (day: string) => parseInt(day, 10);

  const slotDate = useMemo(() => {
    return getDateForDayOfWeek(getDayAsNumber(dayOfTheWeek), true);
  }, [dayOfTheWeek]); // Only recalculates when `dayOfTheWeek` changes
  const { data: timeSlots, isLoading } = useDoctorTimeSlots(
    getDayAsNumber(dayOfTheWeek),
    doctor_id,
    slotDate,
  );
  const { mutate: bookAppointment, isPending: isBooking } =
    useBookAppointment();
  const formatTimeSlot = (time: string): string => {
    return time.split(":").slice(0, 2).join(":");
  };
  const handleSubmit = async () => {
    if (!selectedTimeSlot) {
      toast.warning("select a time slot");
      return;
    }
    if (reason.trim() === "") {
      toast.warning("you need to have a reason for the appointment request");
      return;
    }
    // Get the date for the selected day of week (the `true` parameter ensures we get the upcoming day)
    const appointmentDate = getDateForDayOfWeek(
      getDayAsNumber(dayOfTheWeek),
      true,
    );
    //create full date time objects
    const [startHour, startMinute] = selectedTimeSlot.slot_start_time
      .split(":")
      .map(Number);
    const [endHour, endMinute] = selectedTimeSlot.slot_end_time
      .split(":")
      .map(Number);
    // console.log(startHour, startMinute);
    // Create start and end timestamps by combining the appointment date with time slots
    const startTime = new Date(appointmentDate);
    startTime.setUTCHours(startHour, startMinute, 0, 0);

    const endTime = new Date(appointmentDate);
    endTime.setUTCHours(endHour, endMinute, 0, 0);
    //prepare data for submission
    const appointmentData = {
      doctor_id: doctor_id,
      reason: reason.trim(),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      day_of_week: getDayAsNumber(dayOfTheWeek),
    };
    console.log("appointment data=>", appointmentData);
    bookAppointment(appointmentData, {
      onSuccess: () => {
        // Show success message
        toast.success("the appointment has been scheduled");
        //close the modal
        onClose();
      },
      onError: (error) => {
        // Show error message
        toast.error("failed to book appointment");
        console.error("Failed to book appointment:", error);
      },
    });
  };
  if (!isVisible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center bg-black/50">
        <View className="w-11/12 mt-24 bg-slate-50 dark:bg-backgroundPrimary rounded-xl p-6 max-h-5/6 ">
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-4 items-center">
              <Calendar
                className="h-3 w-3 text-black dark:text-white"
                strokeWidth={2}
              />
              <Text className="font-jakarta-semibold text-xl">
                Book Appointment
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={20} className="text-red-500" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text className="font-jakarta-regular text-slate-700 mb-2 text-sm dark:text-muted-foreground">
            Schedule a virtual consultation with Dr. {full_name}
          </Text>

          {/* Display availability slots */}
          <Tabs
            className="w-full"
            value={dayOfTheWeek}
            onValueChange={setDayOfTheWeek}
          >
            <View className="pt-2 w-full">
              <TabsList className="flex-row bg-transparent flex-wrap  mb-6">
                {days.map((day, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    className={`py-2 w-12 px-1 rounded-sm ${dayOfTheWeek === index.toString() ? "bg-greenPrimary" : "bg-transparent "}`}
                  >
                    <Text
                      className={`text-sm font-jakarta-medium ${dayOfTheWeek === index.toString() ? "text-white" : ""}`}
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
                <View className="flex-row gap-2 items-center mb-4">
                  <Clock className="w-2 h-2 text-muted-foreground" size={20} />
                  <Text className="font-jakarta-regular  text-muted-foreground text-sm">
                    Available time slots for {day}
                  </Text>
                </View>

                {isLoading ? (
                  <SkeletonLoader
                    count={2}
                    containerStyles="gap-2 flex-row mb-8 flex-wrap px-1"
                    skeletonStlyes="rounded-sm px-4 p-2 w-full h-8 w-28"
                  />
                ) : timeSlots && timeSlots.length > 0 ? (
                  <View className=" mb-1 flex-row flex-wrap gap-2">
                    {timeSlots.map((timeslot, idx) => (
                      <Pressable
                        key={idx}
                        disabled={timeslot.slot_status === "booked"}
                        className="border border-input  web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent rounded-sm p-1"
                        onPress={() =>
                          setSelectedTimeSlot({
                            slot_id: idx,
                            slot_start_time: timeslot.slot_start_time,
                            slot_end_time: timeslot.slot_end_time,
                          })
                        }
                      >
                        <Text className="font-jakarta-medium text-xs">
                          {formatTimeSlot(timeslot.slot_start_time)}-
                          {formatTimeSlot(timeslot.slot_end_time)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View className="py-1 items-center ">
                    <Text className="text-muted-foreground">
                      No time slots available for this day
                    </Text>
                  </View>
                )}
              </TabsContent>
            ))}
          </Tabs>
          <View>
            <Label className="mt-4 mb-2" nativeID="reason_label">
              Reason
            </Label>
            <Textarea
              value={reason}
              onChangeText={setReason}
              placeholder="enter a reason for the appointment..."
              aria-labelledby="textareaLabel"
            />
          </View>
          <Button
            disabled={isBooking}
            size="lg"
            onPress={handleSubmit}
            className="bg-greenPrimary w-full my-4"
          >
            <Text className="font-jakarta-semibold  text-white">
              {isBooking ? "Booking..." : "Book appointment"}
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
