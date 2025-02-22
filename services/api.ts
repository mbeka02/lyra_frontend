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
  (res: AxiosResponse) => res.data,
  (err: AxiosError) => {
    const apierror = handleAxiosError(err);
    return Promise.reject(apierror);
  },
);
function handleAxiosError(error: AxiosError): APIError {
  // Fallback error
  const apiError: APIError = {
    status: 0,
    message: "An unknown error occurred",
  };

  // If the request made it to the server and got a response
  if (error.response) {
    apiError.status = error.response.status || 0;

    // Cast the response data to 'any' because server error shapes can vary
    const data = error.response.data as any;

    if (data) {
      if (data.message) {
        apiError.message = data.message;
      }
      if (data.detail) {
        apiError.detail = data.detail;
      }
    }
  } else {
    // If no response, it's likely a network or config error
    apiError.message = error.message || apiError.message;
  }

  return apiError;
}
const handleFetchError = async (response: Response): Promise<APIError> => {
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
export { Api, ApiResponse, handleFetchError };
