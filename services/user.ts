import { User } from "~/types";
import { Api } from "./api";

const getUser = (): Promise<User> => {
  return Api.get("/user");
};

export { getUser };
