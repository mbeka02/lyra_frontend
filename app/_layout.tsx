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
function AuthenticationGuard() {
  const { authState, initialized } = useAuthentication();
  const segments = useSegments();
  const router = useRouter();
  React.useEffect(() => {
    if (!initialized) return;
    const inProtectedGroup = segments[0] === "(protected)";

    // Route authenticated users to appropriate screens when not in protected group
    if (authState?.isAuthenticated && !inProtectedGroup) {
      if (authState.user?.is_onboarded) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    }
    // Redirect unauthenticated users away from protected routes
    else if (!authState?.isAuthenticated && inProtectedGroup) {
      router.replace("/");
    }
  }, [authState, segments, initialized]);
  if (!initialized) {
    return <Loader />;
  }
  return <Slot />;
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
                <AuthenticationGuard />
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
