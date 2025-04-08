export enum ModalType {
  Login = "login",
  SignUp = "signup",
}

export type User = {
  user_id: number;
  is_onboarded: boolean;
  full_name: string;
  email: string;
  telephone_number: string;
  role: string;
  profile_image_url: string;
};
