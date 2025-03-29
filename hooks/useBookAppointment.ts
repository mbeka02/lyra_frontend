import { useMutation } from "@tanstack/react-query";
import { Api } from "~/services/api";

interface AppointmentData {
  doctor_id: number;
  reason: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  amount: string;
}
interface BookingResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
export const useBookAppointment = () => {
  return useMutation({
    mutationFn: (data: AppointmentData): Promise<BookingResponse> => {
      return Api.post("/appointments", data);
    },
  });
};
