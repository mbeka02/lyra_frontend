import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "./ui/text";
import { View } from "react-native";
interface GradientTextProps {
  isUnderlined: boolean;
  text: string;
}
export function GradientText({ isUnderlined, text }: GradientTextProps) {
  return (
    <>
      <MaskedView
        maskElement={
          <Text className="text-2xl font-jakarta-semibold">{text}</Text>
        }
      >
        <LinearGradient
          colors={["#4ade80", "#3b82f6"]} // greenPrimary to bluePrimary
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className=" h-8 w-full"
        />
      </MaskedView>
      <View
        className={
          isUnderlined
            ? "mt-2 w-1/3 h-1   rounded-full overflow-hidden"
            : "hidden"
        }
      >
        <LinearGradient
          colors={["#4ade80", "#3b82f6"]} // greenPrimary to bluePrimary
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-full w-full"
        />
      </View>
    </>
  );
}
