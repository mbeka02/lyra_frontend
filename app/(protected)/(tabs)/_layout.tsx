import React from "react";
import { TabBar } from "@/components/TabBar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./home";
import CalendarScreen from "./calendar";
import SettingsScreen from "./settings";
import { ThemeToggle } from "~/components/ThemeToggle";
// ...

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerRight: () => <ThemeToggle />,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: "Home",
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Calendar"
        options={{
          title: "Calendar",
        }}
        component={CalendarScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          title: "Settings",
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}
