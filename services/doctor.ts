import { Api } from "./api";
import { GetDoctorsResponse } from "./types";

export const getAllDoctors = (
  page: number,
  sortBy: string | null,
  order: string,
  county: string | null,
): Promise<GetDoctorsResponse> => {
  //YEAH THIS SUCKS
  if (county === null || county === "") {
    return Api.get(`/user/doctor?page=${page}&sort=${sortBy}&order=${order}`);
  }
  return Api.get(
    `/user/doctor?page=${page}&county=${county}&sort=${sortBy}&order=${order}`,
  );
};
