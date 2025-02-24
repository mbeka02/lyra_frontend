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
import { doctorOnboardingSchema } from "~/types/zod";
import { onboardDoctor } from "~/services/onboarding";
import { toast } from "sonner-native";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
type FormData = z.infer<typeof doctorOnboardingSchema>;
export function DoctorForm() {
  const router = useRouter();
  const { authState } = useAuthentication();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      specialization: "",
      license_number: "",
      description: "",
      price_per_hour: "",
      years_of_experience: 0,
      county: "",
    },
    resolver: zodResolver(doctorOnboardingSchema),
  });
  const onSubmit = async (data: FormData) => {
    try {
      await onboardDoctor({
        specialization: data.specialization,
        license_number: data.license_number,
        description: data.description,
        price_per_hour: data.price_per_hour,
        years_of_experience: data.years_of_experience,
        county: data.county.toLowerCase(),
      });
      await completeOnboarding(authState?.user?.email!);
      toast.success("completed onboarding");
      router.replace("/(protected)/(tabs)/home");
    } catch (error) {
      toast.error("error:unable to complete onboarding");
      console.error(error);
    }
  };
  return (
    <View className="px-2 mt-1">
      <FormInput
        name="specialization"
        title="Your Specialization"
        control={control}
        placeholder="enter your specialization area"
      />
      <FormInput
        name="license_number"
        title="License Number"
        control={control}
        placeholder="enter your license number"
      />

      <FormInput
        name="years_of_experience"
        title="Years Of Experience"
        control={control}
        placeholder="enter the amount of experience you have"
      />
      <FormInput
        name="price_per_hour"
        title="Pricing"
        control={control}
        placeholder="enter your hourly rate"
      />
      {/*Change to a combobox*/}
      <FormInput
        name="county"
        title="County"
        control={control}
        placeholder="enter your county"
      />
      <Label nativeID="description_label" className="mt-4 mb-2">
        Description
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <Textarea
            value={value}
            onChangeText={onChange}
            aria-labelledby="textareaLabel"
            placeholder="give a brief description of yourself"
            onBlur={onBlur}
          />
        )}
        name="description"
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
