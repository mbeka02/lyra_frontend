import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useAuthentication } from "~/context/AuthContext";
import { useColorScheme } from "~/lib/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

import { Dimensions, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
const { width } = Dimensions.get("window");
interface TabIconProps {
  focused: boolean;
  label: string;
  focusedIcon: keyof typeof Ionicons.glyphMap;
  unfocusedIcon: keyof typeof Ionicons.glyphMap;
}
const TabIcon = ({
  focused,
  label,
  focusedIcon,
  unfocusedIcon,
}: TabIconProps) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View
      style={{
        alignItems: "center",
        paddingTop: 15,
        width: width / 5,
      }}
    >
      <Ionicons
        name={focused ? focusedIcon : unfocusedIcon}
        color={focused ? "#24AE7C" : isDarkColorScheme ? "white" : "black"}
        size={24}
      />
      <Text
        className={`mt-1 text-xs font-jakarta-regular ${focused ? "text-greenPrimary" : ""}`}
      >
        {label}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { authState } = useAuthentication();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#24AE7C",
        headerRight: () => <ThemeToggle />,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 27,
          left: 16,
          right: 16,
          height: 72,
          elevation: 0,
          backgroundColor: isDarkColorScheme ? "#131619" : "#F8FAFC",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Home"
              focusedIcon="home"
              unfocusedIcon="home-outline"
            />
          ),
        }}
        redirect={authState?.isAuthenticated === null}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Calendar"
              focusedIcon="calendar"
              unfocusedIcon="calendar-outline"
            />
          ),
        }}
        redirect={authState?.isAuthenticated === null}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Settings"
              focusedIcon="settings"
              unfocusedIcon="settings-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}
