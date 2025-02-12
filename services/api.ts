import { User } from "@/types";
export type UserAPIResponse = {
  access_token: string;
  user: User;
};
export type APIError = {
  status: number;
  message: string;
  detail?: string;
};

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
export { handleApiError };
