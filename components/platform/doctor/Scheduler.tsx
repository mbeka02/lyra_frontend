import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Switch } from "~/components/ui/switch";
import { useEffect, useState } from "react";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";
import { Plus } from "~/lib/icons/Plus";
import { X } from "~/lib/icons/X";
import { toast } from "sonner-native";
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { HourBlock } from "./HourBlock";
import { Availability } from "~/services/types";
import { IntervalSelector } from "./IntervalSelector";
import { useQueryClient } from "@tanstack/react-query";
import {
  addAvailability,
  getDoctorAvailability,
  removeAvailabilityById,
  removeAvailabilityByDay,
} from "~/services/availability";
import { Loader } from "~/components/Loader";
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const _startHour = 8;
// const _spacing=10;
// const _borderRadius=16;
const _damping = 14;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);
const AnimatedButton = Animated.createAnimatedComponent(Button);
// Format time for API
const formatTimeForAPI = (hour: number, minutes: number = 0): string => {
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
};

// Parse time from API
const parseTimeFromAPI = (
  timeStr: string,
): { hour: number; minutes: number } => {
  const [hour, minutes] = timeStr.split(":").map((part) => parseInt(part, 10));
  return { hour, minutes };
};
// Convert day name to day of week (0-6)
const dayToNumber = (day: string): number => {
  return weekDays.indexOf(day);
};

interface TimeSlot {
  start: { hour: number; minutes: number };
  end: { hour: number; minutes: number };
  interval: number;
  availability_id?: number;
}
const DayBlock = ({
  dayOfWeek,
  existingSlots = [],
}: {
  dayOfWeek: number;
  existingSlots?: TimeSlot[];
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>(
    existingSlots.length > 0 ? existingSlots : [],
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    setSlots(existingSlots);
    console.log("ran day block effect");
  }, [existingSlots]);
  // Save availability mutation
  const { mutate: saveAvailability } = useMutation({
    mutationFn: addAvailability,

    onSuccess: () => {
      // Add this line to invalidate the query after successful save
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
      toast.success("Schedule saved");
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Error saving schedule`);
    },
  });
  // TODO: Add an update interval mutation

  // Delete availability mutation
  const { mutate: deleteAvailability } = useMutation({
    mutationFn: ({ id, index }: { id: number; index: number }) =>
      removeAvailabilityById(id),
    onSuccess: (_, { id, index }) => {
      // Update local state in the onSuccess callback instead
      setSlots((prev) => prev.filter((_, i) => i !== index));
      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
      //toast
      toast.success("removed the time slot");
    },
    // mutationKey: ["doctorAvailability"],
    onError: (error) => {
      console.error(error);
      toast.error(`Error removing the time slot`);
    },
  });
  return (
    <Animated.View
      className="gap-3"
      entering={_entering}
      layout={_layout}
      exiting={_exiting}
    >
      {slots.map((slot, index) => (
        <Animated.View
          entering={_entering}
          layout={_layout}
          exiting={_exiting}
          key={index}
          className="flex-row my-1 items-center gap-2"
        >
          <Text>From:</Text>
          <HourBlock hour={slot.start.hour} minutes={slot.start.minutes} />
          <Text>To:</Text>
          <HourBlock hour={slot.end.hour} minutes={slot.end.minutes} />
          <AnimatedButton
            onPress={() => {
              if (slot.availability_id) {
                deleteAvailability({
                  id: slot.availability_id,
                  index: index,
                });
              }
            }}
            className="flex-row mx-auto items-center rounded  gap-2"
            size="icon"
            variant="outline"
          >
            <X className="text-input" size={14} />
          </AnimatedButton>
        </Animated.View>
      ))}
      <AnimatedButton
        layout={_layout}
        onPress={() => {
          let newStartHour = _startHour;
          let newStartMinutes = 0;

          if (slots.length > 0) {
            const lastSlot = slots[slots.length - 1];
            newStartHour = lastSlot.end.hour;
            newStartMinutes = lastSlot.end.minutes;
          }

          const newSlot = {
            start: { hour: newStartHour, minutes: newStartMinutes },
            end: { hour: newStartHour + 1, minutes: newStartMinutes },
            interval: 60, // Default 60 min
          };

          // Save to database
          saveAvailability({
            start_time: formatTimeForAPI(
              newSlot.start.hour,
              newSlot.start.minutes,
            ),
            end_time: formatTimeForAPI(newSlot.end.hour, newSlot.end.minutes),
            is_recurring: true,
            day_of_week: dayOfWeek,
            interval_minutes: newSlot.interval,
          });

          //update local state
          setSlots((prev) => [...prev, newSlot]);
        }}
        className="flex-row mx-auto items-center rounded  gap-2"
        size="sm"
        variant="link"
      >
        <Plus className="dark:text-white text-black" size={16} />
        <Text className="font-jakarta-semibold dark:text-white text-xs">
          Add More
        </Text>
      </AnimatedButton>
    </Animated.View>
  );
};
const Day = ({
  day,
  existingAvailability,
}: {
  day: (typeof weekDays)[number];
  existingAvailability?: Availability[];
}) => {
  // const queryClient = useQueryClient();
  const dayIndex = dayToNumber(day);
  const dayAvailability =
    existingAvailability?.filter((a) => a.day_of_week === dayIndex) || [];

  // Convert database times to hour/minute objects for the UI
  const existingSlots = dayAvailability.map((a) => {
    const start = parseTimeFromAPI(a.start_time);
    const end = parseTimeFromAPI(a.end_time);
    return {
      start,
      end,
      interval: a.interval_minutes || 60, // Default to 60 min if not specified
      availability_id: a.availability_id,
    };
  });
  // check if daily slots already exist
  const hasExistingSlots = existingSlots.length > 0;
  const [isOn, setIsOn] = useState(hasExistingSlots);
  const { isDarkColorScheme } = useColorScheme();
  const queryClient = useQueryClient();
  // Toggle day availability
  const { mutate: toggleDayAvailability } = useMutation({
    mutationFn: () => removeAvailabilityByDay(dayIndex),
    onSuccess: () => {
      toast.success(`${day} schedule has been updated`);
      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(`error removing ${day}'s schedule`);
      // Revert UI state on error
      setIsOn(!isOn);
      // queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
    },
  });
  return (
    <Animated.View
      className={`border border-solid border-input rounded-3xl px-4 p-2 ${isOn
          ? "bg-transparent"
          : isDarkColorScheme
            ? "bg-backgroundPrimary"
            : "bg-slate-50"
        }`}
      layout={_layout}
    >
      <View
        key={day}
        className=" flex-row py-2 my-2 justify-between items-center"
      >
        <Text
          onPress={() => {
            const newState = !isOn;
            setIsOn(newState);
            if (!newState) {
              toggleDayAvailability();
            }
          }}
          className="font-jakarta-semibold text-sm"
        >
          {day}
        </Text>
        <Switch
          checked={isOn}
          onCheckedChange={(checked) => {
            setIsOn(checked);
            if (!checked) {
              toggleDayAvailability();
            }
          }}
          nativeID={`${day}-switch`}
          className={`${isOn ? "bg-greenPrimary" : ""}   `}
        />
      </View>
      {isOn && <DayBlock existingSlots={existingSlots} dayOfWeek={dayIndex} />}
    </Animated.View>
  );
};
export const Scheduler = () => {
  // Fetch doctor's availability
  const {
    data: availabilityData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctorAvailability"],
    queryFn: getDoctorAvailability,
  });
  const queryClient = useQueryClient();
  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-jakarta-semibold text-red-600">
          Error: Unable to get your schedule details
        </Text>
        <Button
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] })
          }
          className="mt-4 font-jakarta-semibold text-white bg-red-600"
        >
          retry
        </Button>
      </View>
    );
  }
  return (
    <ScrollView className="py-2  px-4">
      <View className="gap-3">
        {weekDays.map((day) => (
          <Day day={day} key={day} existingAvailability={availabilityData} />
        ))}
      </View>
    </ScrollView>
  );
};
