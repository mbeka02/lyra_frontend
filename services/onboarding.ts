import z from "zod";
import {
  patientOnboardingSchema,
  specialistOnboardingSchema,
} from "~/types/zod";
import { Api } from "./api";

const onboardPatient = (values: z.infer<typeof patientOnboardingSchema>) => {
  return Api.post("/user/patient", values);
};

const onboardSpecialist = (
  values: z.infer<typeof specialistOnboardingSchema>,
) => {
  return Api.post("/user/specialist", values);
};
export { onboardPatient, onboardSpecialist };
