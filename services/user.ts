import { User } from "~/types";
import { Api } from "./api";
import z from "zod";
import { profileSchema } from "~/types/zod";
const getUser = (): Promise<User> => {
  return Api.get("/user");
};
const updateUser = (data: z.infer<typeof profileSchema>) => {
  return Api.patch("/user", data);
};
export const updateAvatar = (data: FormData) => {
  return Api.postForm("/user/profilePicture", data);
};

export { getUser, updateUser };
