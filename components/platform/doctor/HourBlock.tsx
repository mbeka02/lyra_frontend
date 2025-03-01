import { Text } from "~/components/ui/text";
import { View } from "react-native";
export const HourBlock = ({
  hour,
  minutes = 0,
}: {
  hour: number;
  minutes?: number;
}) => {
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour >= 12 ? "AM" : "PM";
  return (
    <View className="flex-1 border border-input border-sm items-center justify-center py-1">
      <Text>
        {formattedHour.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")} {period}
      </Text>
    </View>
  );
};
