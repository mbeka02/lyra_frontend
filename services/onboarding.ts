import z from "zod";
import { patientOnboardingSchema, doctorOnboardingSchema } from "~/types/zod";
import { Api } from "./api";

const onboardPatient = (values: z.infer<typeof patientOnboardingSchema>) => {
  return Api.post("/patients", values);
};

const onboardDoctor = (values: z.infer<typeof doctorOnboardingSchema>) => {
  return Api.post("/doctors", values);
};
export { onboardPatient, onboardDoctor };
