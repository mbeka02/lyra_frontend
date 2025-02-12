import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuthentication } from "~/context/AuthContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
SplashScreen.preventAutoHideAsync();
const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
const InitialLayout = () => {
  const { authState, initialized } = useAuthentication();
  const segments = useSegments();
  const router = useRouter();
  React.useEffect(() => {
    if (!initialized) return;

    //check if the user is in the protected group
    const inProtectedGroup = segments[0] === "(protected)";
    if (authState?.isAuthenticated && !inProtectedGroup) {
      router.replace("/(protected)/(tabs)/home");
    } else if (!authState?.isAuthenticated) {
      router.replace("/");
    }
  }, [initialized, authState]);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(protected)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  // const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [loaded] = useFonts({
    "Jakarta-Sans-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Sans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Sans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-Sans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Sans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "Jakarta-Sans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-Sans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  /*
  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);
*/

  return (
    <AuthProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={"light"} />
        <ActionSheetProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView>
              <InitialLayout />
              <Toaster
                theme={isDarkColorScheme ? "dark" : "light"}
                position="top-center"
                toastOptions={{
                  style: {
                    backgroundColor: `${isDarkColorScheme ? "black" : "white"}`,
                  },
                }}
              />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </ActionSheetProvider>
        <PortalHost />
      </ThemeProvider>
    </AuthProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
