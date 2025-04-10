import { createContext, useContext, useEffect, useState } from "react";
import { User } from "~/types";
import { APIError, handleFetchError, UserAPIResponse } from "~/services/api";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";
import { signUpSchema, loginSchema } from "~/types/zod";
import { toast } from "sonner-native";
import { TOKEN_KEY } from "~/constants";

export enum Role {
  SPECIALIST = "specialist",
  PATIENT = "patient",
}
interface AuthProps {
  authState: {
    accessToken: string | null;
    getStreamToken: string | null;
    isAuthenticated: boolean | null;
    user: User | null;
  };
  onRegister: (
    values: z.infer<typeof signUpSchema>,
  ) => Promise<UserAPIResponse>;
  onLogin: (values: z.infer<typeof loginSchema>) => Promise<UserAPIResponse>;
  onLogout: () => Promise<any>;
  updateUserOnboardingStatus: (isOnboarded: boolean) => Promise<void>;
  initialized: boolean;
}
const API_URL = process.env.EXPO_PUBLIC_DEV_URL;
const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuthentication = () => {
  return useContext(AuthContext);
};
interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<{
    accessToken: string | null;
    getStreamToken: string | null;
    isAuthenticated: boolean | null;
    user: User | null;
  }>({
    accessToken: null,
    getStreamToken: null,
    isAuthenticated: null,
    user: null,
  });
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const loadToken = async () => {
      const data = await SecureStore.getItemAsync(TOKEN_KEY);

      if (data) {
        const object = JSON.parse(data);
        // Set our context state
        setAuthState({
          accessToken: object.access_token,
          getStreamToken: object.get_stream_token,
          isAuthenticated: true,
          user: object.user,
        });
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  const handleRegistration = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw await handleFetchError(response);
      }
      const data = await response.json();
      setAuthState({
        accessToken: data.access_token,
        getStreamToken: data.get_stream_token,
        isAuthenticated: true,
        user: data.user,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      if ((error as APIError).detail) {
        console.error(`Error:${(error as APIError).detail}`);
        toast.error("error:unable to create to your account");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      // refactor
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw await handleFetchError(response);
      }

      const data = await response.json();
      setAuthState({
        accessToken: data.access_token,
        getStreamToken: data.get_stream_token,
        isAuthenticated: true,
        user: data.user,
      });
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      if ((error as APIError).detail) {
        console.error(`error:${(error as APIError).detail}`);
        toast.error(`error:${(error as APIError).detail}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({
      accessToken: null,
      getStreamToken: null,

      isAuthenticated: false,
      user: null,
    });
  };
  // Add this function to your AuthProvider component
  const updateUserOnboardingStatus = async (isOnboarded: boolean) => {
    if (!authState.user) {
      toast.error("No user is logged in");
      return;
    }

    // Create updated user and authState
    const updatedUser = {
      ...authState.user,
      is_onboarded: isOnboarded,
    };

    const updatedAuthState = {
      ...authState,
      user: updatedUser,
    };

    // Update state
    setAuthState(updatedAuthState);

    // Update SecureStore
    try {
      // Get existing data from storage first
      const storedData = await SecureStore.getItemAsync(TOKEN_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Update the user in the stored data
        const updatedData = {
          ...parsedData,
          user: updatedUser,
        };
        // Save back to storage
        await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error("Failed to update onboarding status in storage:", error);
      toast.error("Failed to save onboarding status");
    }
  };
  const value = {
    authState,
    updateUserOnboardingStatus,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegistration,
    initialized,
  };
  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};
