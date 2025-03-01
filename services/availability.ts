import { Api } from "./api";
import { Availability } from "./types";
import { removeAvailabilityParams } from "./types";
export const addAvailability = (data: Availability) => {
  return Api.post("/user/doctor/availability", data);
};

export const getDoctorAvailability = (): Promise<Availability[]> => {
  return Api.get("/user/doctor/availability");
};

export const removeAvailability = (id: number) => {
  return Api.delete(`/user/doctor/availability/${id}`);
};
