import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Text } from "../ui/text";
import FormInput from "../form/FormInput";
import { useAuthentication } from "~/context/AuthContext";
import { useRouter } from "expo-router";
import { patientOnboardingSchema } from "~/types/zod";
import { onboardPatient } from "~/services/onboarding";
import { toast } from "sonner-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { Pagination } from "./Pagination";
import { FormButton } from "../form/FormButton";

const _layoutTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);
type FormData = z.infer<typeof patientOnboardingSchema>;

interface PatientFormProps {
  selectedIndex: number;
  total: number;
  onIndexChange: (index: number) => void;
}

export function PatientForm({
  selectedIndex,
  total,
  onIndexChange,
}: PatientFormProps) {
  const router = useRouter();
  const { updateUserOnboardingStatus } = useAuthentication();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      allergies: "",
      past_medical_history: "",
      family_medical_history: "",
      current_medication: "",
      insurance_provider: "",
      insurance_policy_number: "",
      address: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
    },
    resolver: zodResolver(patientOnboardingSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onboardPatient(data);
      await updateUserOnboardingStatus!(true);
      toast.success("Completed onboarding");
      setTimeout(() => router.replace("/home"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Error: Unable to complete onboarding");
    }
  };

  return (
    <View className="px-2 mt-1  h-[70%] relative">
      <Pagination total={total} selectedIndex={selectedIndex} />

      {selectedIndex === 0 && (
        <>
          <Text className="font-jakarta-semibold text-2xl my-1">
            Personal Information
          </Text>
          <FormInput
            name="address"
            title="Address (optional)"
            control={control}
            placeholder="e.g Buruburu phase 5"
          />
          <FormInput
            name="emergency_contact_name"
            title="Emergency Contact Name (optional)"
            control={control}
            placeholder="Enter the name of your guardian"
          />
          <FormInput
            name="emergency_contact_phone"
            title="Emergency Contact Phone (optional)"
            control={control}
            placeholder="e.g. +254115826546"
          />
        </>
      )}

      {selectedIndex === 1 && (
        <>
          <Text className="font-jakarta-semibold text-2xl my-1">
            Medical Information
          </Text>
          <FormInput
            name="allergies"
            title="Allergies (optional)"
            control={control}
            placeholder="e.g pollen, nuts"
          />
          <FormInput
            name="past_medical_history"
            title="Past Medical History (optional)"
            control={control}
            placeholder="e.g Asthma diagnosis in childhood"
            className="h-36"
          />
          <FormInput
            name="family_medical_history"
            title="Family Medical History (if relevant)"
            control={control}
            placeholder="e.g Cancer"
            className="h-36"
          />
          <FormInput
            name="current_medication"
            title="Current Medication (optional)"
            control={control}
            placeholder="e.g. Ibuprofen 200mg"
          />
        </>
      )}

      {selectedIndex === 2 && (
        <>
          <Text className="font-jakarta-semibold text-2xl my-1">
            Insurance Information
          </Text>
          <FormInput
            name="insurance_provider"
            title="Insurance Provider (optional)"
            control={control}
            placeholder="e.g. Old Mutual"
          />
          <FormInput
            name="insurance_policy_number"
            title="Insurance Policy Number (optional)"
            control={control}
          />
        </>
      )}

      <View className="flex-row items-center absolute bottom-0 gap-2">
        {selectedIndex > 0 && (
          <FormButton
            className="dark:bg-white bg-slate-100 flex-1"
            onPress={() => onIndexChange(selectedIndex - 1)}
          >
            <Text className="font-jakarta-semibold text-black">Back</Text>
          </FormButton>
        )}
        <FormButton
          className="bg-greenPrimary flex-1"
          onPress={() => {
            if (selectedIndex >= total - 1) {
              handleSubmit(onSubmit)();
              return;
            }
            onIndexChange(selectedIndex + 1);
          }}
        >
          {selectedIndex === total - 1 ? (
            <Animated.Text
              key="submit"
              className="font-jakarta-semibold text-white"
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
            >
              Submit
            </Animated.Text>
          ) : (
            <Animated.Text
              key="continue"
              className="font-jakarta-semibold text-white"
              layout={_layoutTransition}
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
            >
              Continue
            </Animated.Text>
          )}
        </FormButton>
      </View>
    </View>
  );
}
