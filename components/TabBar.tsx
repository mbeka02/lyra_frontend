import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, LayoutChangeEvent, Keyboard } from "react-native";
import TabBarButton from "./TabBarButton";
import { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useColorScheme } from "~/lib/useColorScheme";
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>();
  const { isDarkColorScheme } = useColorScheme();
  const buttonWidth = dimensions.width / state.routes.length;
  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };
  const tabPosition = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPosition.value }],
    };
  });
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      onLayout={onTabbarLayout}
      style={[
        styles.tabbar,
        keyboardStatus ? styles.hideNavigation : null,
        isDarkColorScheme ? styles.darkMode : styles.lightMode,
      ]}
    >
      {
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              backgroundColor: "#24AE7C",
              borderRadius: 99,
              marginHorizontal: 12,
              height: dimensions.height - 10,
              width: buttonWidth - 25,
            },
          ]}
        />
      }
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPosition.value = withSpring(buttonWidth * index, {
            duration: 1000,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isDarkColorScheme ? "white" : isFocused ? "white" : "black"}
            //@ts-ignore
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 55,
    paddingVertical: 15,
    overflow: "hidden",
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },

  hideNavigation: {
    display: "none",
  },
  darkMode: {
    backgroundColor: "#131619",
  },
  lightMode: {
    backgroundColor: "#F8FAFC",
  },
});
