import { Api } from "./api";
import { AppointmentSlots, GetDoctorsResponse } from "./types";

export const getAllDoctors = (
  page: number,
  sortBy: string | null,
  order: string,
  county: string | null,
): Promise<GetDoctorsResponse> => {
  //YEAH THIS SUCKS
  if (county === null || county === "") {
    return Api.get(`/doctors?page=${page}&sort=${sortBy}&order=${order}`);
  }
  return Api.get(
    `/doctors?page=${page}&county=${county}&sort=${sortBy}&order=${order}`,
  );
};

export const requestDoctorTimeSlots = (
  day_of_week: number,
  doctor_id: number,
  slot_date: Date,
): Promise<AppointmentSlots[]> => {
  return Api.post(`/doctors/availability/slots`, {
    day_of_week,
    doctor_id,
    slot_date,
  });
};
