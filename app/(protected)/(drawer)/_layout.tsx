import { Drawer } from "expo-router/drawer";
import {
  Home,
  Search,
  Calendar,
  Settings,
  Pill,
  FileText,
} from "lucide-react-native";
import { Role, useAuthentication } from "~/providers/AuthProvider";
import { useColorScheme } from "~/lib/useColorScheme";
import CustomDrawerContent from "~/components/CustomDrawerContent";

type DrawerIconProps = {
  color: string;
  size: number;
};

export default function DrawerLayout() {
  const { authState } = useAuthentication();
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
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
        drawerActiveBackgroundColor: "#24AE7C",
        drawerActiveTintColor: "#ffffff",
        drawerInactiveTintColor: isDarkColorScheme ? "white" : "black",
        drawerStyle: {
          backgroundColor: isDarkColorScheme ? "#121212" : "#F8FAFC",
          width: 280,
          paddingTop: 20,
        },
        drawerLabelStyle: {
          marginLeft: -16,
          fontSize: 16,
          fontFamily: "Jakarta-Sans-Regular",
        },
        drawerItemStyle: {
          borderRadius: 8,
          paddingLeft: 8,
          marginHorizontal: 8,
          marginVertical: 4,
        },
        headerTintColor: isDarkColorScheme ? "white" : "black",
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Home style={{ marginRight: 15 }} color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="search"
        options={{
          title: "Search",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Search style={{ marginRight: 15 }} color={color} size={size} />
          ),
        }}
        redirect={authState?.user?.role !== Role.PATIENT}
      />
      <Drawer.Screen
        name="appointments"
        options={{
          title: "Appointments",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Calendar style={{ marginRight: 15 }} color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="prescriptions"
        options={{
          title: "Prescriptions",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Pill style={{ marginRight: 15 }} color={color} size={size} />
          ),
        }}
        redirect={authState?.user?.role !== Role.PATIENT}
      />
      <Drawer.Screen
        name="records"
        options={{
          title: "Records",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FileText style={{ marginRight: 15 }} color={color} size={size} />
          ),
        }}
        redirect={authState?.user?.role !== Role.PATIENT}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Settings style={{ marginRight: 15 }} color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
