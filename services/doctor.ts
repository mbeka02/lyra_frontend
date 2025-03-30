import { Api } from "./api";
import { AppointmentSlots, GetDoctorsResponse } from "./types";

// export const getAllDoctors = (
//   page: number,
//   sortBy: string | null,
//   order: string,
//   county: string | null,
// ): Promise<GetDoctorsResponse> => {
//   if (county === null || county === "") {
//     return Api.get(`/doctors?page=${page}&sort=${sortBy}&order=${order}`);
//   }
//   return Api.get(
//     `/doctors?page=${page}&county=${county}&sort=${sortBy}&order=${order}`,
//   );
// };
export const getAllDoctors = (
  page: number,
  sortBy: "experience" | "price" | null,
  order: "asc" | "desc",
  county: string | null,
  minExperience?: string,
  maxExperience?: string,
  minPrice?: string,
  maxPrice?: string,
): Promise<GetDoctorsResponse> => {
  // Create URL params object
  const params = new URLSearchParams();

  // Add parameters only if they have valid values
  if (page !== null && page !== undefined)
    params.append("page", page.toString());
  if (sortBy) params.append("sort", sortBy);
  if (order) params.append("order", order);
  if (county && county.trim() !== "") params.append("county", county);
  if (minExperience && minExperience.trim() !== "")
    params.append("minExperience", minExperience);
  if (maxExperience && maxExperience.trim() !== "")
    params.append("maxExperience", maxExperience);
  if (minPrice && minPrice.trim() !== "") params.append("minPrice", minPrice);
  if (maxPrice && maxPrice.trim() !== "") params.append("maxPrice", maxPrice);

  // Convert params to string and append to base URL
  const queryString = params.toString();
  return Api.get(`/doctors${queryString ? "?" + queryString : ""}`);
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
