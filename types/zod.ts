import z from "zod";
import validator from "validator";

export const specialistOnboardingSchema = z.object({
  specialization: z.string(),
  license_number: z.string(),
});
export const loginSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(8, "password must be a minimum of 8 characters"),
});

export const signUpSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email("invalid email format"),
  telephone_number: z.string().refine(validator.isMobilePhone),
  password: z.string().min(8, "password must be a minimum of 8 characters"),
  role: z.string(),
});

export const patientOnboardingSchema = z.object({
  allergies: z.string().optional(),
  dob: z.date(),
});
