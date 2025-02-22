import { Api } from "./api";
import { GetDoctorsResponse } from "./types";

export const getAllDoctors = (page: number): Promise<GetDoctorsResponse> => {
  return Api.get(`/user/doctor?page=${page}`);
};
