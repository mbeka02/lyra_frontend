import { View } from "react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Available meeting duration options
const intervalOptions = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "3 hours", value: 180 },
];
export const IntervalSelector = ({
  // value,
  onChange,
  className = "",
}: {
  // value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  return (
    <View className={`${className}`}>
      <Select
        onValueChange={(option) =>
          onChange(parseInt(option?.value ?? "60", 10))
        }
        defaultValue={{ label: "1 hour", value: (60).toString() }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue
            className="text-foreground text-sm native:text-lg"
            placeholder="Select an interval"
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className="w-[250px]">
          <SelectGroup>
            {intervalOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value.toString()}
                label={option.label}
              />
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
};
