import { Api } from "./api";
import { Availability } from "./types";
export const addAvailability = (data: Availability) => {
  return Api.post("/user/doctor/availability", data);
};

export const getDoctorAvailability = (): Promise<Availability[]> => {
  return Api.get("/user/doctor/availability");
};

export const removeAvailabilityById = (availabilityId: number) => {
  return Api.delete(`/user/doctor/availability/id/${availabilityId}`);
};

export const removeAvailabilityByDay = (dayIndex: number) => {
  return Api.delete(`/user/doctor/availability/day/${dayIndex}`);
};
