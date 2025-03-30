import { ActivityIndicator, View } from "react-native";

export function Loader() {
  return (
    <View className="flex-1 justify-center items-center bg-transparent ">
      <ActivityIndicator size="large" color="#24AE7C" />
    </View>
  );
}
