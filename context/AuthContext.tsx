import { createContext, useContext, useEffect, useState } from "react";
import { User } from "~/types";
import { APIError, handleApiError, UserAPIResponse } from "~/services/api";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";
import { signUpSchema } from "~/components/SignUp";
import { loginSchema } from "~/components/Login";
import { toast } from "sonner-native";
import { TOKEN_KEY } from "~/constants";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}
interface AuthProps {
  authState: {
    token: string | null;
    isAuthenticated: boolean | null;
    user: User | null;
  };
  onRegister: (
    values: z.infer<typeof signUpSchema>,
  ) => Promise<UserAPIResponse>;
  onLogin: (values: z.infer<typeof loginSchema>) => Promise<UserAPIResponse>;
  onLogout: () => Promise<any>;
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
    token: string | null;
    isAuthenticated: boolean | null;
    user: User | null;
  }>({
    token: null,
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
          token: object.access_token,
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
        throw await handleApiError(response);
      }
      const data = await response.json();
      setAuthState({
        token: data.access_token,
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
        throw await handleApiError(response);
      }

      const data = await response.json();
      setAuthState({
        token: data.access_token,
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
      token: null,
      isAuthenticated: false,
      user: null,
    });
  };
  const value = {
    authState,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegistration,
    initialized,
  };
  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};
