import { Tabs } from "expo-router";
import { Role, useAuthentication } from "~/context/AuthContext";
import CustomNavBar from "~/components/CustomNavBar";
import { Logout } from "~/components/auth/Logout";
export default function Tabslayout() {
  const { authState } = useAuthentication();
  return (
    <Tabs
      tabBar={(props) => <CustomNavBar {...props} />}
      screenOptions={{
        headerRight: () => <Logout />,
        headerStyle: {
          height: 80,
        },
        headerTitleStyle: {
          fontFamily: "Jakarta-Sans-SemiBold",
          fontSize: 15,
          textTransform: "uppercase",
        },
        headerTitleContainerStyle: {
          width: 100,
          marginLeft: 15,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
        redirect={authState?.user?.role !== Role.PATIENT}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Appointments",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
