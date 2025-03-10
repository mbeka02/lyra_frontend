type Doctor = {
  doctor_id: number;
  full_name: string;
  specialization: string;
  profile_image_url: string;
  description: string;
  years_of_experience: number;
  price_per_hour: string;
  county: string;
};
export interface Availability {
  availability_id?: number;
  doctor_id?: number;
  start_time: string; // "HH:MM:SS" format
  end_time: string; // "HH:MM:SS" format
  is_recurring: boolean;
  specific_date?: string; // "YYYY-MM-DD" format for non-recurring
  day_of_week: number; // 0-6 for Sunday-Saturday
  interval_minutes?: number; // Meeting interval in minutes
}
export type removeAvailabilityParams = {
  start_time: string;
  end_time: string;
  day_of_week: number;
};
export type GetDoctorsResponse = {
  doctors: Doctor[];
  has_more: boolean;
};
export type AppointmentSlots = {
  slot_start_time: string;
  slot_end_time: string;
  slot_status: string;
};
