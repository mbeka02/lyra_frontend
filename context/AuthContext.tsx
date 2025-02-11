import { createContext, useContext, useEffect, useState } from "react";
import { User, UserResponse } from "~/types";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";
import { signUpSchema } from "~/components/SignUp";
import { loginSchema } from "~/components/Login";
interface AuthProps {
  authState: {
    token: string | null;
    isAuthenticated: boolean | null;
    user: User | null;
  };
  onRegister: (values: z.infer<typeof signUpSchema>) => Promise<UserResponse>;
  onLogin: (values: z.infer<typeof loginSchema>) => Promise<UserResponse>;
  onLogout: () => Promise<any>;
  initialized: boolean;
}
const TOKEN_KEY = "my-token";
const API_URL = process.env.EXPO_PUBLIC_DEV_URL;
const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuthentication = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
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
          token: object.token,
          isAuthenticated: true,
          user: object.user,
        });
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  const handleRegistration = async (
    values: z.infer<typeof signUpSchema>,
  ): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setAuthState({
        token: data.access_token,
        isAuthenticated: true,
        user: data.user,
      });
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(`registration error:${error}`);
    }
  };
  const handleLogin = async (
    values: z.infer<typeof loginSchema>,
  ): Promise<UserResponse> => {
    try {
      // refactor
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAuthState({
        token: data.access_token,
        isAuthenticated: true,
        user: data.user,
      });
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(`login error:${error}`);
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
