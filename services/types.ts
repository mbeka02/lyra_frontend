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
export type AppointmentStatus =
  | "pending_payment"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

// Base appointment fields shared between doctor and patient views
export interface BaseAppointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  current_status: AppointmentStatus;
  reason: string;
  notes: {
    String: string;
    Valid: boolean;
  };
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string | null; // ISO date string or null
}

// Patient-specific view of appointments (includes doctor details)
export interface PatientAppointment extends BaseAppointment {
  specialization: string;
  doctor_name: string;
  doctor_profile_image_url: string;
}

// Doctor-specific view of appointments (includes patient details)
export interface DoctorAppointment extends BaseAppointment {
  patient_name: string;
  patient_profile_image_url: string;
}

// Union type for either kind of appointment
export type Appointment = PatientAppointment | DoctorAppointment;

// Type guard to check if an appointment is a patient appointment
export function isPatientAppointment(
  appointment: Appointment,
): appointment is PatientAppointment {
  return "doctor_name" in appointment;
}

// Type guard to check if an appointment is a doctor appointment
export function isDoctorAppointment(
  appointment: Appointment,
): appointment is DoctorAppointment {
  return "patient_name" in appointment;
}
