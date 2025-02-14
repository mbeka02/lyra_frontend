import { User } from "@/types";
import * as SecureStore from "expo-secure-store";

export type UserAPIResponse = {
  access_token: string;
  user: User;
};
export type APIError = {
  status: number;
  message: string;
  detail?: string;
};
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { TOKEN_KEY } from "~/constants";
const url = process.env.EXPO_PUBLIC_DEV_URL;

const Api: AxiosInstance = axios.create({ baseURL: url });

Api.interceptors.request.use(async (config) => {
  const data = await SecureStore.getItemAsync(TOKEN_KEY);

  if (data) {
    const object = JSON.parse(data);
    config.headers.set("Authorization", `Bearer ${object.access_token}`);
  }
  return config;
});

Api.interceptors.response.use(
  async (res: AxiosResponse) => res.data,
  async (err: AxiosError) => Promise.reject(err),
);

const handleApiError = async (response: Response): Promise<APIError> => {
  let error: APIError = {
    status: response.status,
    message: "An unknown error occurred",
  };

  try {
    const errorData = await response.json();
    if (errorData.message) {
      error.message = errorData.message;
    }
    if (errorData.detail) {
      error.detail = errorData.detail;
    }
  } catch (err) {
    console.error("Failed to parse error response", err);
  }

  return error;
};
type ApiResponse<Data> = {
  data: Data;
};
export { Api, ApiResponse, handleApiError };
