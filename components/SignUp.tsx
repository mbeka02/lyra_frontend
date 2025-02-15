import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { Input } from "./ui/input";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";
import { Text } from "./ui/text";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuthentication } from "~/context/AuthContext";
import FormInput from "./form/FormInput";
import { Mail } from "lucide-react-native";
export const signUpSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email("invalid email format"),
  telephone_number: z.string().refine(validator.isMobilePhone),
  password: z.string().min(8, "password must be a minimum of 8 characters"),
  role: z.string(),
});
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
    },
    resolver: zodResolver(signUpSchema),
  });
  const { onRegister } = useAuthentication();
  const onSubmit = async (data: FormData) => {
    console.log(data.role);

    await onRegister!(data);
  };
  return (
    <View className="px-2 mt-1">
      <FormInput
        name="full_name"
        title="Full Name"
        control={control}
        placeholder="e.g David Njoroge"
      />

      <Label nativeID="role_label" className="mt-4 mb-2">
        Account Type
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            onValueChange={(value) => onChange(value)}
            defaultValue={{ value: "patient", label: "Patient" }}
          >
            <SelectTrigger className="">
              <SelectValue
                className="text-foreground text-sm native:text-lg"
                placeholder="Select an account type"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="">
              <SelectGroup>
                <SelectLabel>Account Type</SelectLabel>
                <SelectItem label="Patient" value="patient">
                  Patient
                </SelectItem>
                <SelectItem label="Medical Specialist" value="specialist">
                  Medical Specilaist
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
        placeholder="e.g +254XXXXXXXXX"
        name="telephone_number"
        control={control}
      />
      <FormInput
        control={control}
        title="Email"
        name="email"
        icon={Mail}
        iconPosition="left"
        placeholder="e.g davidnjoroge@example.com"
      />
      <FormInput control={control} title="Password" name="password" />

      <Button
        className="bg-greenPrimary font-jakarta-semibold   py-2 px-1  my-8 rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-jakarta-semibold ">Register</Text>
      </Button>
    </View>
  );
}
