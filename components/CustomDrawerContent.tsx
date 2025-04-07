import { useEffect } from "react";
import { View } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "./ui/text";
import { useAuthentication } from "~/context/AuthContext";
import UserAvatar from "./platform/shared/UserAvatar";
export default function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const drawerProgress = useSharedValue(0);

  const viewStyles = useAnimatedStyle(() => {
    const translateX = interpolate(drawerProgress.value, [0, 1], [-100, 0]);
    return {
      transform: [{ translateX }],
    };
  });
  const { authState } = useAuthentication();
  useEffect(() => {
    drawerProgress.value = withTiming(1, { duration: 500 });
  }, []);

  return (
    <DrawerContentScrollView
      {...props}
      className="flex-1 bg-slate-50 dark:bg-backgroundPrimary"
    >
      <Animated.View style={viewStyles} className="px-4 py-6">
        <View className="items-center mb-12">
          <UserAvatar uri={authState?.user?.profile_image_url} size={80} />
          <Text className="text-lg font-jakarta-semibold">
            {authState?.user?.full_name}
          </Text>
          <Text className="text-sm font-jakarta-regular  text-gray-500">
            {authState?.user?.email}
          </Text>
        </View>
        <View className="flex-1">
          <DrawerItemList {...props} />
        </View>
      </Animated.View>
    </DrawerContentScrollView>
  );
}
