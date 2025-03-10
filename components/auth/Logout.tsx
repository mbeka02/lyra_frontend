import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthentication } from "~/context/AuthContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

import { Text } from "~/components/ui/text";
import { LogOut } from "lucide-react-native";

export const Logout = () => {
  const { onLogout } = useAuthentication();
  const { isDarkColorScheme } = useColorScheme();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="web:ring-offset-background border-none bg-transparent web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 mr-5"
          size="icon"
        >
          <LogOut
            strokeWidth={2}
            size={18}
            color={isDarkColorScheme ? "white" : "black"}
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-jakarta-semibold text-2xl mb-2">
            Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="font-jakarta-regular">
            Are you sure you want to log out of your account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-jakarta-semibold">
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            onPress={onLogout}
            className="bg-red-600 font-jakarta-semibold text-white"
          >
            <Text>Continue</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
