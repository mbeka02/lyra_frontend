import "~/global.css";
import * as React from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useColorScheme } from "~/lib/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";
import { AuthProvider } from "~/context/AuthContext";
import { Toaster } from "sonner-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useAuthentication } from "~/context/AuthContext";
import { checkOnboardingStatus } from "~/constants";
import { NAV_THEME } from "~/lib/constants";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Loader } from "~/components/Loader";
// Prevent auto-hiding of splash screen
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});
const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};
const queryClient = new QueryClient();
function InitialLayout() {
  const { authState, initialized } = useAuthentication();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const handleNavigation = async () => {
      // Prevent multiple navigations
      if (!initialized || isNavigating || !isMounted) return;

      try {
        setIsNavigating(true);
        const inProtectedGroup = segments[0] === "(protected)";

        if (authState?.isAuthenticated) {
          if (!inProtectedGroup) {
            // Only check onboarding if we're not already in the protected group
            const isOnboarded = await checkOnboardingStatus(
              authState.user?.email!,
            );
            const route = isOnboarded
              ? "/(protected)/(drawer)/home"
              : "/(protected)/onboarding";

            if (isMounted) {
              router.replace(route);
            }
          }
        } else if (segments[0] !== undefined) {
          // Only redirect to home if we're not already there
          if (isMounted) {
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        if (isMounted) {
          setIsNavigating(false);
        }
      }
    };

    handleNavigation();

    return () => {
      isMounted = false;
    };
  }, [initialized, authState?.isAuthenticated, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const [isLayoutReady, setIsLayoutReady] = React.useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Sans-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Sans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Sans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-Sans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Sans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "Jakarta-Sans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-Sans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  React.useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-background");
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLayoutReady(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    if (fontsLoaded && isLayoutReady) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn("Error hiding splash screen:", error);
      });
    }
  }, [fontsLoaded, isLayoutReady]);

  if (!fontsLoaded || !isLayoutReady || fontError) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "dark" : "light"} />
          <ActionSheetProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <InitialLayout />
                <Toaster
                  closeButton
                  theme={isDarkColorScheme ? "dark" : "light"}
                  position="top-center"
                  visibleToasts={2}
                  toastOptions={{
                    style: {
                      backgroundColor: isDarkColorScheme
                        ? "#131619"
                        : "#F8FAFC",
                    },
                  }}
                />
                <PortalHost />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </ActionSheetProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
