import { useMutation } from "@tanstack/react-query";
import { Api } from "~/services/api"; // Adjust to your API service

interface AppointmentData {
  doctor_id: number;
  reason: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
}

export const useBookAppointment = () => {
  return useMutation({
    mutationFn: (data: AppointmentData) => {
      return Api.post("/user/appointment", data);
    },
  });
};
