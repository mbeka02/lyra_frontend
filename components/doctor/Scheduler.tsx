import { View, ScrollView } from "react-native";
import { Text } from "../ui/text";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "../ui/button";
import { Plus } from "~/lib/icons/Plus";
import { X } from "~/lib/icons/X";
import { toast } from "sonner-native";
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
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

const HourBlock = ({ block }: { block: number }) => {
  return (
    <View className="flex-1 border border-input border-sm items-center justify-center py-1">
      <Text>
        {block > 9 ? block : `0${block}`}:00{" "}
        {block > 11 && block < 24 ? "PM" : "AM"}
      </Text>
    </View>
  );
};
const DayBlock = () => {
  const [hours, setHours] = useState([_startHour]);

  return (
    <Animated.View
      className="gap-3"
      entering={_entering}
      layout={_layout}
      exiting={_exiting}
    >
      {hours.map((hour, index) => (
        <Animated.View
          entering={_entering}
          layout={_layout}
          exiting={_exiting}
          key={index}
          className="flex-row my-1 items-center gap-2"
        >
          <Text>From:</Text>
          <HourBlock block={hour} />
          <Text>To:</Text>
          <HourBlock block={hour + 1} />
          <AnimatedButton
            onPress={() => {
              //TODO: ADD LOGIC
              setHours((prev) => [...prev.filter((val) => val !== hour)]);
              toast.info(`removed the slot from you schedule`);
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
          //TODO: ADD LOGIC
          if (hours.length === 0) {
            setHours([_startHour]);
          }
          setHours((prev) => [...prev, prev[prev.length - 1] + 1]);
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
const Day = ({ day }: { day: (typeof weekDays)[number] }) => {
  const [isOn, setIsOn] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
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
            setIsOn((prev) => !prev);
          }}
          className="font-jakarta-semibold text-sm"
        >
          {day}
        </Text>
        <Switch
          checked={isOn}
          onCheckedChange={setIsOn}
          nativeID={`${day}-switch`}
          className={`${isOn ? "bg-greenPrimary" : ""}   `}
        />
      </View>
      {isOn && <DayBlock />}
    </Animated.View>
  );
};
export const Scheduler = () => {
  return (
    <ScrollView className="py-2  px-4">
      <View className="gap-3">
        {weekDays.map((day) => (
          <Day day={day} key={day} />
        ))}
      </View>
    </ScrollView>
  );
};
