import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { useAuthentication } from "~/context/AuthContext";
import FormInput from "./form/FormInput";
import { Mail } from "lucide-react-native";
export const loginSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(8, "password must be a minimum of 8 characters"),
});
type FormData = z.infer<typeof loginSchema>;
export function Login() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const { onLogin } = useAuthentication();
  const onSubmit = async (data: FormData) => {
    await onLogin!(data);
  };
  return (
    <View className="px-2 mt-1">
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
        className="bg-greenPrimary my-8 py-2 px-1   rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-jakarta-semibold">Login</Text>
      </Button>
    </View>
  );
}
