import z from "zod";
import { patientOnboardingSchema, doctorOnboardingSchema } from "~/types/zod";
import { Api } from "./api";

const onboardPatient = (values: z.infer<typeof patientOnboardingSchema>) => {
  return Api.post("/user/patient", values);
};

const onboardDoctor = (values: z.infer<typeof doctorOnboardingSchema>) => {
  return Api.post("/user/doctor", values);
};
export { onboardPatient, onboardDoctor };
