import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Text } from "../ui/text";
import FormInput from "../form/FormInput";
import { useAuthentication } from "~/providers/AuthProvider";
import { useRouter } from "expo-router";
import { doctorOnboardingSchema } from "~/types/zod";
import { onboardDoctor } from "~/services/onboarding";
import { toast } from "sonner-native";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Pagination } from "./Pagination";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { FormButton } from "../form/FormButton";
type FormData = z.infer<typeof doctorOnboardingSchema>;
interface DoctorFormProps {
  selectedIndex: number;
  total: number;
  onIndexChange: (index: number) => void;
}

const _layoutTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);
export function DoctorForm({
  selectedIndex,
  total,
  onIndexChange,
}: DoctorFormProps) {
  const router = useRouter();
  const { updateUserOnboardingStatus } = useAuthentication();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
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
      await updateUserOnboardingStatus!(true);
      toast.success("Completed onboarding");
      router.replace("/home");
    } catch (error) {
      toast.error("Unable to complete onboarding");
      console.error(error);
    }
  };

  return (
    <View className="px-2 mt-1 relative h-[70%]">
      <Pagination total={total} selectedIndex={selectedIndex} />

      {/* Step 1: Personal Information */}
      {selectedIndex === 0 && (
        <>
          <Text className="font-jakarta-semibold text-2xl my-1">
            Personal Information
          </Text>

          <FormInput
            name="county"
            title="County(required)"
            control={control}
            placeholder="Enter your county"
          />

          <FormInput
            name="years_of_experience"
            title="Years of Experience(required)"
            control={control}
            placeholder="How many years have you practiced?"
          />

          <Label nativeID="description_label" className="mt-4 mb-2">
            Description(required)
          </Label>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value, onBlur } }) => (
              <Textarea
                value={value}
                onChangeText={onChange}
                placeholder="Briefly describe your background and approach"
                onBlur={onBlur}
              />
            )}
          />
          {errors.description && (
            <Text className="text-red-600 font-jakarta-bold">
              {errors.description.message}
            </Text>
          )}
        </>
      )}

      {/* Step 2: Professional Details */}
      {selectedIndex === 1 && (
        <>
          <Text className="font-jakarta-semibold text-2xl my-1">
            Professional Details
          </Text>

          <FormInput
            name="specialization"
            title="Specialization(required)"
            control={control}
            placeholder="E.g. Dermatology, Pediatrics, etc."
          />

          <FormInput
            name="license_number"
            title="License Number(required)"
            control={control}
            placeholder="Enter your medical license number"
          />

          <FormInput
            name="price_per_hour"
            title="Hourly Rate (KES)"
            control={control}
            placeholder="How much do you charge per hour?"
          />
        </>
      )}

      {/* Navigation Buttons */}
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
