import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./ui/input";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";
import { Text } from "./ui/text";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
const schema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(8, "password must be a minimum of 8 characters"),
});
type FormData = z.infer<typeof schema>;
export function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    console.log(data);
  };
  return (
    <View className="px-2 mt-1">
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
        className="bg-greenPrimary mt-8 py-2 px-1  rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="dark:text-white font-semibold text-black ">Login</Text>
      </Button>
    </View>
  );
}
