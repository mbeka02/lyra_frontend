import { ModalType } from "~/types";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./ui/text";
interface AuthModalProps {
  authType: ModalType | null;
}
export function AuthModal({ authType }: AuthModalProps) {
  return (
    <BottomSheetView className=" px-4 p-2 gap-4 bg-secondary">
      <TouchableOpacity className="flex-row gap-2 px-2 dark:text-white text-black  items-center">
        <Text className="text-xl font-semibold">
          {authType === ModalType.Login ? "Login" : "Sign Up"}
        </Text>
      </TouchableOpacity>
      {authType === ModalType.Login ? <Login /> : <SignUp />}
    </BottomSheetView>
  );
}
