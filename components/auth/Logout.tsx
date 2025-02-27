import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthentication } from "~/context/AuthContext";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react-native";

export const Logout = () => {
  const { onLogout } = useAuthentication();
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Button
      onPress={onLogout}
      className="web:ring-offset-background border-none bg-transparent web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
      size="icon"
    >
      <LogOut size={18} color={isDarkColorScheme ? "white" : "black"} />
    </Button>
  );
};
