import z from "zod";
import validator from "validator";

export const doctorOnboardingSchema = z.object({
  specialization: z.string().min(2, "Specialization is required"),
  license_number: z
    .string()
    .min(5, "License number must be at least 5 characters"),
  description: z.string().min(20, "The description is too short"),
  years_of_experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(0)),
  price_per_hour: z.string(),
  county: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  telephone_number: z
    .string()
    .refine(validator.isMobilePhone, { message: "Invalid phone number" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(3, "Role is required"),
});

export const patientOnboardingSchema = z.object({
  allergies: z.string().optional(),
  date_of_birth: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format" },
  ),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  telephone_number: z
    .string()
    .refine(validator.isMobilePhone, { message: "Invalid phone number" }),
});
