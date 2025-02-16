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

export const patientOnboardingSchema = z.object({
  allergies: z.string().optional(),
  // dob: z.date(),
});
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
    console.log(data);
    await completeOnboarding(authState?.user?.email!);
    router.replace("/(protected)/(tabs)/home");
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
