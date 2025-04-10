import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePicker } from "~/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAuthentication } from "~/providers/AuthProvider";
import FormInput from "~/components/form/FormInput";
import { Mail } from "lucide-react-native";
import { signUpSchema } from "~/types/zod";
type FormData = z.infer<typeof signUpSchema>;
export function SignUp() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      telephone_number: "",
      role: "patient",
      date_of_birth: new Date(),
    },
    resolver: zodResolver(signUpSchema),
  });
  const { onRegister } = useAuthentication();
  const onSubmit = async (data: FormData) => {
    await onRegister!(data);
  };
  return (
    <View className="px-2 mt-1">
      <FormInput
        name="full_name"
        title="Full Name"
        control={control}
        placeholder="enter your full name"
      />
      <Label nativeID="role_label" className="mt-4 mb-2">
        Account Type
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            onValueChange={(option) => onChange(option?.value)}
            defaultValue={{ value: "patient", label: "Patient" }}
          >
            <SelectTrigger className="">
              <SelectValue
                className="text-foreground text-sm native:text-lg"
                placeholder="select an account type"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="">
              <SelectGroup>
                <SelectLabel>Account Type</SelectLabel>
                <SelectItem label="Patient" value="patient">
                  Patient
                </SelectItem>
                <SelectItem label="Doctor" value="specialist">
                  Doctor
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        name="role"
      />
      {errors.role && (
        <Text className="text-red-600 font-jakarta-bold">
          {errors.role.message}
        </Text>
      )}
      <FormInput
        title="Telephone"
        placeholder="enter your mobile number"
        name="telephone_number"
        control={control}
      />
      <Label nativeID="date_of_birth_label" className="mt-4 mb-2">
        Date of Birth
      </Label>

      <Controller
        control={control}
        name="date_of_birth"
        render={({ field }) => (
          <DatePicker
            onChange={(date) => field.onChange(date)}
            currentDate={field.value}
          />
        )}
      />
      {errors.date_of_birth && (
        <Text className="text-red-600 font-jakarta-bold">
          {errors.date_of_birth.message}
        </Text>
      )}

      <FormInput
        control={control}
        title="Email"
        name="email"
        icon={Mail}
        iconPosition="left"
        placeholder="enter your email"
      />
      <FormInput
        control={control}
        placeholder="enter your password"
        title="Password"
        name="password"
      />

      <Button
        className="bg-greenPrimary font-jakarta-semibold   py-2 px-1  my-8 rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-jakarta-semibold ">Register</Text>
      </Button>
    </View>
  );
}
