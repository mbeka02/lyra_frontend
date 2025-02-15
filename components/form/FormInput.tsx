import { useState } from "react";
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
import { Label } from "../ui/label";
import type { LucideIcon } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { StyleSheet } from "react-native";
interface CustomProps {
  title: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}
type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Pick<ControllerProps<TFieldValues, TName>, "name" | "control" | "rules"> &
  TextInputProps &
  CustomProps;

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
  icon: Icon,
  iconPosition,
  className,
  ...rest
}: FormInputProps<T, U>) {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  console.log("icon", Icon);
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
              className={cn(
                iconPosition === "left" ? "pl-12" : "pr-12",
                className,
              )}
            />

            {name === "password" && (
              <TouchableOpacity
                className="absolute top-1/2  -translate-y-1/2  right-3"
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
            {Icon && (
              <Icon
                style={[
                  styles.icon,
                  iconPosition === "left" ? styles.iconLeft : styles.iconRight,
                ]}
                size={20}
                strokeWidth={1.25}
                stroke={isDarkColorScheme ? "white" : "black"}
              />
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

const styles = StyleSheet.create({
  icon: {
    position: "absolute",

    top: "50%",
    transform: [{ translateY: "-50%" }],
  },
  iconLeft: {
    left: 12,
  },
  iconRight: {
    right: 12,
  },
});
