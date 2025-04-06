import React, { ReactNode } from "react";
import { TouchableOpacity, View, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router"; // Import based on your navigation setup
import { Text } from "./ui/text";
type QuickActionButtonProps = {
  /** Title to display below the icon */
  title?: string;
  /** Icon component to display (should be a React element) */
  icon: ReactNode;
  /** Array of colors for the gradient background */
  gradientColors?: [string, string, ...string[]];
  /** Navigation route to push to when pressed */
  route: string;
  /** Size of the circular icon container */
  iconSize?: number;
  /** Optional additional styles */
  style?: StyleProp<ViewStyle>;
};

const QuickActionButton = ({
  title,
  icon,

  gradientColors = ["#4ade80", "#3b82f6"],
  route,
  iconSize = 60,
  style,
}: QuickActionButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(route as Href);
  };

  return (
    <TouchableOpacity
      className="flex dark:bg-backgroundPrimary shadow  rounded-md bg-slate-50 items-center justify-center p-4 w-full   "
      style={style}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: iconSize,
          height: iconSize,
          overflow: "hidden",
          borderRadius: iconSize / 2,
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </LinearGradient>
      </View>

      {title && (
        <Text className=" text-sm font-jakarta-medium text-center mt-2">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default QuickActionButton;
