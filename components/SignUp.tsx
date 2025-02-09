import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { Input } from "./ui/input";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";
import { Text } from "./ui/text";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email("invalid email format"),
  telephone_number: z.string().refine(validator.isMobilePhone),
  password: z.string().min(8, "password must be a minimum of 8 characters"),
  role: z.string(),
});
type FormData = z.infer<typeof schema>;
export function SignUp() {
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
      role: "",
    },
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    console.log(data);
  };
  return (
    <View className="px-2 mt-1">
      <Label nativeID="full_name_label" className="mt-4 mb-2">
        Full Name
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="e.g David Njoroge"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="full_name"
      />
      {errors.full_name && (
        <Text className="text-red-600">{errors.full_name.message}</Text>
      )}
      <Label nativeID="role_label" className="mt-4 mb-2">
        Role
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="e.g Patient or Specialist"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="role"
      />
      {errors.role && (
        <Text className="text-red-600">{errors.role.message}</Text>
      )}
      <Label nativeID="telephone_label" className="mt-4 mb-2">
        Telephone Number
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="e.g +254XXXXXXXXX"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="telephone_number"
      />
      {errors.telephone_number && (
        <Text className="text-red-600">{errors.telephone_number.message}</Text>
      )}

      <Label nativeID="email_label" className="mt-4 mb-2">
        Email
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="e.g davidnjoroge22@example.com"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text className="text-red-600">{errors.email.message}</Text>
      )}
      <Label nativeID="password_label" className="mt-4 mb-2">
        Password
      </Label>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="........"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text className="text-red-600">{errors.password.message}</Text>
      )}
      <Button
        className="bg-greenPrimary dark:text-white text-black font-semibold py-2 px-1  rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </View>
  );
}
