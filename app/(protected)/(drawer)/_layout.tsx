// import { Tabs } from "expo-router";
// import { Role, useAuthentication } from "~/context/AuthContext";
// import CustomNavBar from "~/components/CustomNavBar";
// import { Logout } from "~/components/auth/Logout";
// export default function Tabslayout() {
//   const { authState } = useAuthentication();
//   return (
//     <Tabs
//       tabBar={(props) => <CustomNavBar {...props} />}
//       screenOptions={{
//         headerRight: () => <Logout />,
//         headerStyle: {
//           height: 80,
//         },
//         headerTitleStyle: {
//           fontFamily: "Jakarta-Sans-SemiBold",
//           fontSize: 15,
//           textTransform: "uppercase",
//         },
//         headerTitleContainerStyle: {
//           width: 100,
//           marginLeft: 15,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: "Home",
//         }}
//       />
//       <Tabs.Screen
//         name="search"
//         options={{
//           title: "Search",
//         }}
//         redirect={authState?.user?.role !== Role.PATIENT}
//       />
//       <Tabs.Screen
//         name="appointments"
//         options={{
//           title: "Appointments",
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: "Settings",
//         }}
//       />
//     </Tabs>
//   );
// }
import { Drawer } from "expo-router/drawer";
import { Home, Search, Calendar, Settings } from "lucide-react-native";
import { Role, useAuthentication } from "~/context/AuthContext";
import { Logout } from "~/components/auth/Logout";
import { useColorScheme } from "~/lib/useColorScheme";

type DrawerIconProps = {
  color: string;
  size: number;
};

export default function DrawerLayout() {
  const { authState } = useAuthentication();
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Drawer
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
            <Home style={{ marginRight: 10 }} color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="search"
        options={{
          title: "Search",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Search style={{ marginRight: 10 }} color={color} size={size} />
          ),
        }}
        redirect={authState?.user?.role !== Role.PATIENT}
      />
      <Drawer.Screen
        name="appointments"
        options={{
          title: "Appointments",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Calendar style={{ marginRight: 10 }} color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Settings style={{ marginRight: 10 }} color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
