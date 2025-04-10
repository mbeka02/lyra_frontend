import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useAuthentication } from "~/providers/AuthProvider";
import FormInput from "~/components/form/FormInput";
import { Mail } from "lucide-react-native";
import { loginSchema } from "~/types/zod";
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
