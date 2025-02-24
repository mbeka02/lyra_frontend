import { ModalType } from "~/types";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { TouchableOpacity } from "react-native";
import { Text } from "./ui/text";
import { View } from "react-native";
interface AuthModalProps {
  authType: ModalType | null;
}
export function AuthModal({ authType }: AuthModalProps) {
  return (
    <BottomSheetView className=" px-4 p-2 gap-4 dark:bg-background   ">
      <TouchableOpacity className="flex-row gap-2 px-2 dark:text-white text-black  items-center">
        <View className="my-2">
          {authType === ModalType.Login ? (
            <View className="flex flex-col gap-1">
              <Text className=" text-xl font-jakarta-semibold">Login</Text>
              <Text className="font-jakarta-regular text-sm dark:[#ABB8C4]">
                enter your email and password
              </Text>
            </View>
          ) : (
            <View className="flex flex-col gap-1">
              <Text className=" text-xl font-jakarta-semibold">Sign Up</Text>
              <Text className="font-jakarta-regular text-sm dark:[#ABB8C4]">
                Create your account
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {authType === ModalType.Login ? <Login /> : <SignUp />}
    </BottomSheetView>
  );
}
