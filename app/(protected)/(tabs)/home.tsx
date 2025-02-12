import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuthentication } from "~/context/AuthContext";
export default function HomeScreen() {
  const { onLogout } = useAuthentication();
  return (
    <View>
      <Button className="bg-greenPrimary" onPress={onLogout}>
        <Text>Logout</Text>
      </Button>
      <Text>Home screen</Text>
    </View>
  );
}
