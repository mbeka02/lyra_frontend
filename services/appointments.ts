import { Api } from "./api";
import { PatientAppointment, DoctorAppointment } from "./types";

export const getPatientAppointments = (
  status: string,
  interval?: number,
): Promise<PatientAppointment[]> => {
  const params = new URLSearchParams();
  if (status && status.trim() !== "") params.append("status", status);
  if (interval) params.append("interval", interval.toString());
  // Convert params to string and append to base URL
  const queryString = params.toString();
  return Api.get(
    `/patients/appointments${queryString ? "?" + queryString : ""}`,
  );
};

export const getDoctorAppointments = (
  status: string,
  interval: number = 21,
): Promise<DoctorAppointment[]> => {
  const params = new URLSearchParams();
  if (status && status.trim() !== "") params.append("status", status);
  if (interval) params.append("interval", interval.toString());
  // Convert params to string and append to base URL
  const queryString = params.toString();
  return Api.get(
    `/doctors/appointments${queryString ? "?" + queryString : ""}`,
  );
};
