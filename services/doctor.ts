import { Api } from "./api";
import { GetDoctorsResponse } from "./types";

export const getAllDoctors = (
  page: number,
  sortBy: string | null,
  order: string,
): Promise<GetDoctorsResponse> => {
  return Api.get(`/user/doctor?page=${page}&sort=${sortBy}&order=${order}`);
};
