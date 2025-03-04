import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Pressable, PressableProps, View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import { completeOnboarding } from "~/constants";
import { useAuthentication } from "~/context/AuthContext";
import { useRouter } from "expo-router";
import { patientOnboardingSchema } from "~/types/zod";
import { onboardPatient } from "~/services/onboarding";
import { toast } from "sonner-native";
import Animated, {
  AnimatedProps,
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// const _spacing=8;
// const _buttonHeight=42;
const _layoutTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);
function FormButton({
  children,
  style,
  ...rest
}: AnimatedProps<PressableProps>) {
  return (
    <AnimatedPressable
      {...rest}
      entering={FadeInLeft.springify().damping(80).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
      layout={_layoutTransition}
    >
      {children}
    </AnimatedPressable>
  );
}
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
  const { authState } = useAuthentication();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      allergies: "",
      past_medical_history: "",
      family_medical_history: "",
      current_medication: "",
      insurance_provider: "",
      insurance_policy_number: "",
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
        title="Allergies (optional)"
        control={control}
        placeholder="enter any allergies that you may have"
      />
      <FormInput
        name="past_medical_history"
        title="Past Medical History (optional)"
        control={control}
        placeholder=""
        className="h-36"
      />
      <FormInput
        name="family_medical_history"
        title="Family Medical History (optional)"
        control={control}
        placeholder=""
        className="h-36"
      />
      <FormInput
        name="current_medication"
        title="Current Medication (optional)"
        control={control}
        placeholder=""
      />
      <FormInput
        name="insurance_provider"
        title="Insurance Provider(optional)"
        control={control}
        placeholder=""
      />

      <FormInput
        name="insurance_policy_number"
        title="Insurance Policy Number (optional)"
        control={control}
      />
      <Button
        className="bg-greenPrimary font-jakarta-semibold   py-2 px-1  my-8 rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-jakarta-semibold ">Submit</Text>
      </Button>
      <View className="flex-row items-center gap-2">
        {selectedIndex > 0 && (
          <FormButton
            className="dark:bg-white bg-slate-100  flex-1"
            onPress={() => {
              onIndexChange(selectedIndex - 1);
            }}
          >
            <Text className="font-jakarta-semibold text-black">Back</Text>
          </FormButton>
        )}
        <FormButton
          className="bg-greenPrimary flex-1"
          onPress={() => {
            if (selectedIndex === total) return;
            onIndexChange(selectedIndex + 1);
          }}
        >
          {selectedIndex === total ? (
            <Animated.Text className="font-jakarta-semibold text-white">
              Finish
            </Animated.Text>
          ) : (
            <Animated.Text
              className="font-jakarta-semibold text-white"
              layout={_layoutTransition}
            >
              Continue
            </Animated.Text>
          )}
        </FormButton>
      </View>
    </View>
  );
}
