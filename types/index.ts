export enum ModalType {
  Login = "login",
  SignUp = "signup",
}

type ProfileImage = {
  String: string;
  Valid: boolean;
};
export type User = {
  full_name: string;
  email: string;
  telephone_number: string;
  role: string;
  profile_image_url: ProfileImage;
};
