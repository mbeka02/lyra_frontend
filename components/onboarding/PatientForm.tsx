import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import { completeOnboarding } from "~/constants";
import { useAuthentication } from "~/context/AuthContext";
import { useRouter } from "expo-router";
import { patientOnboardingSchema } from "~/types/zod";
import { Label } from "../ui/label";
import { onboardPatient } from "~/services/onboarding";
import { toast } from "sonner-native";

type FormData = z.infer<typeof patientOnboardingSchema>;
export function PatientForm() {
  const router = useRouter();
  const { authState } = useAuthentication();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      allergies: "",
    },
    resolver: zodResolver(patientOnboardingSchema),
  });
  const onSubmit = async (data: FormData) => {
    try {
      await onboardPatient(data);
      await completeOnboarding(authState?.user?.email!);
      toast.success("completed onboarding");
      router.replace("/(protected)/(tabs)/home");
    } catch (error) {
      console.error(error);
      toast.error("error:unable to complete onboarding");
    }
  };
  return (
    <View className="px-2 mt-1">
      <FormInput
        name="allergies"
        title="Allergies"
        control={control}
        placeholder="enter any allergies that you may have"
      />

      <Button
        className="bg-greenPrimary font-jakarta-semibold   py-2 px-1  my-8 rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-jakarta-semibold ">Submit</Text>
      </Button>
    </View>
  );
}
