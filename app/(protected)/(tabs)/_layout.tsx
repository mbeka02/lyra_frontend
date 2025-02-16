import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useAuthentication } from "~/context/AuthContext";

export default function TabLayout() {
  const { authState } = useAuthentication();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#24AE7C",
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
        redirect={authState?.isAuthenticated === null}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
