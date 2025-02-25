import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Platform, View } from "react-native";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { useColorScheme } from "~/lib/useColorScheme";
import { Input } from "./ui/input";
import { useState } from "react";
interface DateTimePickerProps {
  onChange: (date: Date) => void;
  currentDate: Date;
}

export function DatePicker(props: DateTimePickerProps) {
  if (Platform.OS === "android") {
    return <AndroidDateTimePicker {...props} />;
  }
  if (Platform.OS === "ios") {
    return <IOSDateTimePicker {...props} />;
  }
  return null;
}
function IOSDateTimePicker({ onChange, currentDate }: DateTimePickerProps) {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <RNDateTimePicker
      style={{ alignSelf: "center" }}
      themeVariant={isDarkColorScheme ? "dark" : "light"}
      minimumDate={new Date()}
      value={currentDate}
      mode={"date"}
      display="default"
      onChange={(_, date) => onChange(date || new Date())}
    />
  );
}
function AndroidDateTimePicker({ onChange, currentDate }: DateTimePickerProps) {
  const [manualDate, setManualDate] = useState<string>(formatDate(currentDate));

  // Format date to a string (e.g., "YYYY-MM-DD")
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Parse a string into a Date object
  function parseDate(dateString: string): Date | null {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Validate "YYYY-MM-DD" format
    if (!regex.test(dateString)) {
      return null; // Invalid format
    }
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
  }
  // Handle manual date input
  const handleManualDateChange = (text: string) => {
    setManualDate(text);
    const parsedDate = parseDate(text);
    if (parsedDate) {
      onChange(parsedDate); // Update the parent component's date
    }
  };
  // Open the Android date picker
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (_, date?: Date) => {
        if (date) {
          onChange(date);
          setManualDate(formatDate(date)); // Update the manual input field
        }
      },
      mode: "date",
    });
  };
  return (
    <View className="flex flex-row items-center w-full justify-between ">
      <Input
        value={manualDate}
        onChangeText={handleManualDateChange}
        placeholder="YYYY-MM-DD"
        keyboardType="numeric"
        className="w-1/2"
      />
      <Button className="bg-greenPrimary" onPress={showDatePicker}>
        <Text className="font-jakarta-semibold text-white">Open Calendar</Text>
      </Button>
    </View>
  );
}
