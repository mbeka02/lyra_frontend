type Doctor = {
  doctor_id: string;
  full_name: string;
  specialization: string;
  profile_image_url: string;
  description: string;
};

export type GetDoctorsResponse = {
  doctors: Doctor[];
  has_more: boolean;
};
