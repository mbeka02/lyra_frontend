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
import { Text } from "~/components/ui/text";
import { useState, useCallback } from "react";
export const Logout = ({ children }: { children: React.ReactNode }) => {
  const { onLogout } = useAuthentication();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(() => {
    if (isLoggingOut || !onLogout) return;

    setIsLoggingOut(true);

    // Wrap the logout in setTimeout to allow the dialog to close fully first
    setTimeout(async () => {
      try {
        await onLogout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setIsLoggingOut(false);
      }
    }, 500);
  }, [onLogout, isLoggingOut]);
  if (!onLogout) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
            onPress={handleLogout}
            className={`${isLoggingOut ? "bg-greenPrimary" : "bg-red-600"} font-jakarta-semibold  text-white`}
            disabled={isLoggingOut}
          >
            <Text>{isLoggingOut ? "Logging Out" : "Continue"}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
