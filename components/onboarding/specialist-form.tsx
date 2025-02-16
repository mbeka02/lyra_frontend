import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import { completeOnboarding } from "~/constants";
import { useAuthentication } from "~/context/AuthContext";
import { useRouter } from "expo-router";
export const specialistOnboardingSchema = z.object({
  specialization: z.string(),
  license_number: z.string(),
});
type FormData = z.infer<typeof specialistOnboardingSchema>;
export function SpecialistForm() {
  const router = useRouter();
  const { authState } = useAuthentication();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      specialization: "",
      license_number: "",
    },
    resolver: zodResolver(specialistOnboardingSchema),
  });
  const onSubmit = async (data: FormData) => {
    console.log(data);
    await completeOnboarding(authState?.user?.email!);
    router.replace("/(protected)/(tabs)/home");
  };
  return (
    <View className="px-2 mt-1">
      <FormInput
        name="specialization"
        title="specialization"
        control={control}
        placeholder="enter your specialization area"
      />
      <FormInput
        name="license_number"
        title="License Number"
        control={control}
        placeholder="enter your license number"
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
