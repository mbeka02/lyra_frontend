import React, { useEffect, useState } from "react";
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
import { useDoctorTimeSlots } from "~/hooks/useDoctorTimeSlots";
import { SkeletonLoader } from "../shared/SkeletonLoader";
import { getDateForDayOfWeek, getUTCDateForDayOfWeek } from "~/utils/dates";
import { useMemo } from "react";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { toast } from "sonner-native";
import { useBookAppointment } from "~/hooks/useBookAppointment";
import { useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

interface DoctorDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  doctor: {
    full_name: string;
    doctor_id: number;
    price_per_hour: string;
  };
}

export function AppointmentModal({
  isVisible,
  onClose,
  doctor,
}: DoctorDetailsModalProps) {
  const { full_name, doctor_id, price_per_hour } = doctor;
  // Generate dates array for the next 7 days
  const [dateOptions, setDateOptions] = useState<
    Array<{
      day: string;
      date: number;
      dayIndex: number;
      fullDate: Date;
    }>
  >([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [reason, setReason] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    slot_id: number;
    slot_start_time: string;
    slot_end_time: string;
  } | null>(null);
  const queryClient = useQueryClient();
  //populate the date options
  useEffect(() => {
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (currentDayIndex + i) % 7;
      const fullDate = getUTCDateForDayOfWeek(dayIndex, true);

      return {
        day: days[dayIndex],
        date: fullDate.getDate(),
        dayIndex: dayIndex,
        fullDate: fullDate,
      };
    });

    setDateOptions(nextSevenDays);
  }, []);
  // Function to convert string back to number when needed for API calls
  // const getDayAsNumber = (day: string) => parseInt(day, 10);

  const selectedDate = useMemo(() => {
    return (
      dateOptions[selectedDateIndex] || { dayIndex: 0, fullDate: new Date() }
    );
  }, [selectedDateIndex, dateOptions]); // Only recalculates when the date index or options change
  const { data: timeSlots, isLoading } = useDoctorTimeSlots(
    selectedDate.dayIndex,
    doctor_id,
    selectedDate.fullDate,
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
    // Get the appointment date
    const appointmentDate = selectedDate.fullDate;
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

    const totalCost = (
      price_per_hour: string,
      start_time: Date,
      end_time: Date,
    ): string => {
      const price = parseFloat(price_per_hour);
      // Calculate the difference in milliseconds, then convert to hours (including fractions)
      const diffMs = end_time.getTime() - start_time.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const cost = price * diffHours;
      return cost.toFixed(2); // Format cost to two decimals
    };
    const appointmentData = {
      doctor_id: doctor_id,
      reason: reason.trim(),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      day_of_week: selectedDate.dayIndex,
      amount: totalCost(price_per_hour, startTime, endTime),
    };
    bookAppointment(appointmentData, {
      onSuccess: async (response) => {
        //close modal
        onClose();
        // Show redirect message

        toast.info("redirecting to payment gateway...");
        try {
          const paymentURL = response.data.authorization_url;
          const supported = await Linking.canOpenURL(paymentURL);
          if (!supported) {
            toast.error(
              " unable to redirect to the payment gateway, kindly contact support ",
            );
            return;
          }
          await Linking.openURL(paymentURL);
        } catch (error) {
          toast.error(
            "unable to redirect to the payment gateway, kindly contact support",
          );
          console.error(error);
        }
        //refetch available time slots
        queryClient.invalidateQueries({
          queryKey: [
            "doctorTimeSlots",
            doctor_id,
            selectedDate.dayIndex,
            selectedDate.fullDate,
          ],
        });
        //reset text area
        setReason("");
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
      animationType="fade"
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

          {/* Date Selector */}
          <View className="pt-2 mb-6">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            >
              <View className="flex-row justify-between">
                {dateOptions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDateIndex(index)}
                    className={`w-12 h-14 mx-2 rounded-sm border-input border justify-center items-center ${selectedDateIndex === index
                        ? "bg-greenPrimary"
                        : "bg-transparent"
                      }`}
                  >
                    <Text
                      className={`text-xs font-jakarta-medium ${selectedDateIndex === index
                          ? "text-white"
                          : "text-gray-500"
                        }`}
                    >
                      {item.day}
                    </Text>
                    <Text
                      className={`text-base font-jakarta-semibold ${selectedDateIndex === index
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200"
                        }`}
                    >
                      {item.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Time Slots */}
          <View className="mb-4">
            <View className="flex-row gap-2 items-center mb-4">
              <Clock className="w-2 h-2 text-muted-foreground" size={20} />
              <Text className="font-jakarta-regular text-muted-foreground text-sm">
                Available time slots for {selectedDate.day}
              </Text>
            </View>

            {isLoading ? (
              <SkeletonLoader
                count={2}
                containerStyles="gap-2 flex-row mb-8 flex-wrap px-1"
                skeletonStlyes="rounded-sm px-4 p-2 w-full h-8 w-28"
              />
            ) : timeSlots && timeSlots.length > 0 ? (
              <View className="mb-1 flex-row flex-wrap gap-2">
                {timeSlots.map((timeslot, idx) => (
                  <Pressable
                    key={idx}
                    disabled={timeslot.slot_status === "booked"}
                    className={`border border-input rounded-sm p-1 ${selectedTimeSlot?.slot_id === idx
                        ? "bg-greenPrimary"
                        : "bg-transparent"
                      } ${timeslot.slot_status === "booked"
                        ? "opacity-40"
                        : "opacity-100"
                      }`}
                    onPress={() =>
                      setSelectedTimeSlot({
                        slot_id: idx,
                        slot_start_time: timeslot.slot_start_time,
                        slot_end_time: timeslot.slot_end_time,
                      })
                    }
                  >
                    <Text
                      className={`font-jakarta-medium text-xs ${selectedTimeSlot?.slot_id === idx ? "text-white" : ""
                        }`}
                    >
                      {formatTimeSlot(timeslot.slot_start_time)}-
                      {formatTimeSlot(timeslot.slot_end_time)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="py-1 items-center">
                <Text className="text-muted-foreground">
                  No time slots available for this day
                </Text>
              </View>
            )}
          </View>

          {/* Reason input */}
          <View>
            <Label className="mt-4 mb-2" nativeID="reason_label">
              Reason
            </Label>
            <Textarea
              value={reason}
              onChangeText={setReason}
              placeholder="Enter a reason for the appointment..."
              aria-labelledby="textareaLabel"
            />
          </View>

          {/* Submit button */}
          <Button
            disabled={isBooking}
            size="lg"
            onPress={handleSubmit}
            className="bg-greenPrimary w-full my-4"
          >
            <Text className="font-jakarta-semibold text-white">
              {isBooking ? "Booking..." : "Book appointment"}
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
