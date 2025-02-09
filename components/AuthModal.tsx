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
    <BottomSheetView className="flex-1 items-start p-2 gap-4">
      <TouchableOpacity className="flex-row gap-14 items-center">
        <Ionicons name="mail-outline" size={20} />
        <Text className="text-lg">
          {authType === ModalType.Login ? "Login" : "SignUp"}
        </Text>
      </TouchableOpacity>
      {authType === ModalType.Login ? <Login /> : <SignUp />}
    </BottomSheetView>
  );
}
