import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Platform, View } from "react-native";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { useColorScheme } from "~/lib/useColorScheme";
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
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (_, date?: Date) => onChange(date || new Date()),
      mode: "date",
    });
  };
  return (
    <View className="flex flex-col justify-self-center gap-2 items-center">
      <Text className="font-jakarta-medium">
        {currentDate.toLocaleDateString()}
      </Text>
      <Button
        className="bg-greenPrimary text-white font-jakarta-semibold"
        onPress={showDatePicker}
      >
        Open Calendar
      </Button>
    </View>
  );
}
