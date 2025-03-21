import { Api } from "./api";
import { Availability } from "./types";
export const addAvailability = (data: Availability) => {
  return Api.post("/doctors/availability", data);
};

export const getDoctorAvailability = (): Promise<Availability[]> => {
  return Api.get("/doctors/availability");
};

export const removeAvailabilityById = (availabilityId: number) => {
  return Api.delete(`/doctors/availability/id/${availabilityId}`);
};

export const removeAvailabilityByDay = (dayIndex: number) => {
  return Api.delete(`/doctors/availability/day/${dayIndex}`);
};
