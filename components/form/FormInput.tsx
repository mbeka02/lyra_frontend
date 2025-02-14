import { ComponentProps, useState } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { View, TextInputProps, TouchableOpacity } from "react-native";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Eye } from "@/lib/icons/Eye";
import { EyeOff } from "@/lib/icons/EyeOff";
import { useColorScheme } from "~/lib/useColorScheme";
// import { Eye, EyeOff } from "lucide-react-native";
import { Label } from "../ui/label";
interface LabelProps {
  title: string;
}
type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Pick<ControllerProps<TFieldValues, TName>, "name" | "control" | "rules"> &
  TextInputProps &
  LabelProps;

export default function FormInput<
  T extends FieldValues = FieldValues,
  U extends FieldPath<T> = FieldPath<T>,
>({
  name,
  control,
  rules,
  onChange,
  onBlur,
  title,
  ...rest
}: FormInputProps<T, U>) {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <Label nativeID={`${name}_label`} className="mt-4 mb-2">
            {title}
          </Label>
          <View className="w-full relative">
            <Input
              {...rest}
              {...field}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
              secureTextEntry={!showPassword && name === "password"}
            />
            {name === "password" && (
              <TouchableOpacity
                className="absolute top-1/2 text-black -translate-y-1/2  right-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <Eye
                    size={20}
                    strokeWidth={1.25}
                    stroke={isDarkColorScheme ? "white" : "black"}
                  />
                ) : (
                  <EyeOff
                    size={20}
                    strokeWidth={1.25}
                    stroke={isDarkColorScheme ? "white" : "black"}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

          {fieldState.error && fieldState.error.message && (
            <Text className="text-red-600 text-sm font-jakarta-bold">
              {fieldState.error.message}
            </Text>
          )}
        </>
      )}
    />
  );
}
