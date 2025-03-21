import { User } from "~/types";
import { Api } from "./api";
import z from "zod";
import { profileSchema } from "~/types/zod";
const getUser = (): Promise<User> => {
  return Api.get("/users/me");
};
const updateUser = (data: z.infer<typeof profileSchema>) => {
  return Api.patch("/users/me", data);
};
const updateAvatar = (data: FormData) => {
  return Api.patchForm("/users/me/profile-picture", data);
};

export { getUser, updateUser, updateAvatar };
