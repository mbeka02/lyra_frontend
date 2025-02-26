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
    <View className="gap-3">
      {hours.map((hour, index) => (
        <View key={index} className="flex-row my-1 items-center gap-2">
          <Text>From:</Text>
          <HourBlock block={hour} />
          <Text>To:</Text>
          <HourBlock block={hour + 1} />
          <Button
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
          </Button>
        </View>
      ))}
      <Button
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
        <Text className="font-jakarta-semibold dark:text-white text-sm">
          Add More
        </Text>
      </Button>
    </View>
  );
};
const Day = ({ day }: { day: (typeof weekDays)[number] }) => {
  const [isOn, setIsOn] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View
      className={`border border-solid border-input rounded-3xl px-4 p-2 ${isOn
          ? "bg-transparent"
          : isDarkColorScheme
            ? "bg-backgroundPrimary"
            : "bg-slate-50"
        }`}
    >
      <View
        key={day}
        className=" flex-row py-2 my-2 justify-between items-center"
      >
        <Text
          onPress={() => {
            setIsOn((prev) => !prev);
          }}
          className="font-jakarta-regular text-sm"
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
    </View>
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
