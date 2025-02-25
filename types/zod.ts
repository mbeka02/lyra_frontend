import z from "zod";
import validator from "validator";
const dateSchema = z.union([
  z.string().refine(
    (val) => {
      // Validate the string format (e.g., "YYYY-MM-DD")
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(val)) return false;

      // Parse the date and ensure it's valid
      const [year, month, day] = val.split("-").map(Number);
      const date = new Date(year, month - 1, day); // Month is 0-indexed
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    },
    { message: "Invalid date format. Use YYYY-MM-DD." },
  ),
  z
    .date()
    .refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date object.",
    }),
]);
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
  price_per_hour: z.string().min(1, "Price per hour is required"),
  county: z.string().min(1, "County is required"),
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
  // date_of_birth: z.union([z.string(), z.date()]).refine(
  //   (val) => {
  //     const date = new Date(val);
  //     return !isNaN(date.getTime());
  //   },
  //   { message: "Invalid date format" },
  // ),
  date_of_birth: dateSchema,
});

export const patientOnboardingSchema = z.object({
  allergies: z.string().optional(),
  //TODO: Add the other stuff
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  telephone_number: z
    .string()
    .refine(validator.isMobilePhone, { message: "Invalid phone number" }),
});
