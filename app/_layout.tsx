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

// Theme configuration
const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

// Create query client outside component to prevent recreation on renders
const queryClient = new QueryClient();

// Custom hook for fonts loading
function useAppFonts() {
  return useFonts({
    "Jakarta-Sans-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Sans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Sans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-Sans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Sans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "Jakarta-Sans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-Sans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });
}

// Custom hook for initialization
function useAppInitialization() {
  const [isLayoutReady, setIsLayoutReady] = React.useState(false);
  const [fontsLoaded, fontError] = useAppFonts();

  React.useEffect(() => {
    async function prepare() {
      try {
        // Small delay to ensure everything is loaded properly
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

  return { fontsLoaded, fontError, isLayoutReady };
}

// Authentication and route protection
function AuthenticationGuard({ children }: { children: React.ReactNode }) {
  const { authState, initialized } = useAuthentication();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const handleNavigation = async () => {
      // Prevent multiple navigations or unnecessary work
      if (!initialized || isNavigating || !isMounted) return;

      try {
        setIsNavigating(true);
        const inProtectedGroup = segments[0] === "(protected)";

        if (authState?.isAuthenticated) {
          if (!inProtectedGroup) {
            // Check onboarding status only when not in protected routes
            const isOnboarded = await checkOnboardingStatus(
              authState.user?.email!,
            );
            const route = isOnboarded ? "/home" : "/onboarding";

            if (isMounted) {
              router.replace(route);
            }
          }
        } else if (segments[0] !== undefined) {
          // Only redirect if not already at home
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

  return children;
}

// Toast component with theme support
function ThemedToaster() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Toaster
      closeButton
      theme={isDarkColorScheme ? "dark" : "light"}
      position="top-center"
      visibleToasts={2}
      toastOptions={{
        style: {
          backgroundColor: isDarkColorScheme ? "#131619" : "#F8FAFC",
        },
      }}
    />
  );
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const { fontsLoaded, fontError, isLayoutReady } = useAppInitialization();

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
                <AuthenticationGuard>
                  <Slot />
                </AuthenticationGuard>
                <ThemedToaster />
                <PortalHost />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </ActionSheetProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
