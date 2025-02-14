import { useEffect } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { getUser } from "~/services/user";
export default function SettingsScreen() {
  const fetchUser = async () => {
    const user = await getUser();
    console.log(user);
  };

  return (
    <View>
      <Button onPress={fetchUser}>
        <Text>get user</Text>
      </Button>
      <Text>Settings screen</Text>
    </View>
  );
}
