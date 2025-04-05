import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  BottomTabBarProps,
  BottomTabNavigationEventMap,
} from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationRoute,
  ParamListBase,
  TabNavigationState,
  NavigationHelpers,
} from "@react-navigation/native";
const PRIMARY_COLOR = "#24AE7C";
const SECONDARY_COLOR = "#ffffff";
const TAB_ITEM_SIZE = 42;
const TabItem = ({
  route,
  state,
  index,
  navigation,
}: {
  route: NavigationRoute<ParamListBase, string>;
  index: number;
  state: TabNavigationState<ParamListBase>;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}) => {
  // Skip hidden routes
  if (["_sitemap", "+not-found"].includes(route.name)) {
    return null;
  }

  const isFocused = state.index === index;

  const rTabItemViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(isFocused ? 1 : 0) }],
      opacity: withTiming(isFocused ? 1 : 0),
    }),
    [isFocused],
  );

  const rIconStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(isFocused ? 1.1 : 1) }],
    }),
    [isFocused],
  );

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      accessibilityRole="button"
    >
      <Animated.View style={[rTabItemViewStyle, styles.tabItemView]} />
      <Animated.View style={rIconStyle}>
        {getIcon(route.name, isFocused ? PRIMARY_COLOR : SECONDARY_COLOR)}
      </Animated.View>
    </TouchableOpacity>
  );
  function getIcon(name: string, color: string) {
    switch (name) {
      case "home":
        return <Ionicons name="home" size={26} color={color} />;
      case "search":
        return <Ionicons name="search" size={26} color={color} />;
      case "appointments":
        return <Ionicons name="calendar" size={26} color={color} />;
      case "settings":
        return <Ionicons name="settings" size={26} color={color} />;

      default:
        return <Ionicons name="home" size={26} color={color} />;
    }
  }
};
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          state={state}
          index={index}
          navigation={navigation}
        />
      ))}
      ;
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 35,
    backgroundColor: PRIMARY_COLOR,
    width: "60%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    width: TAB_ITEM_SIZE,
    height: TAB_ITEM_SIZE,
  },
  tabItemView: {
    position: "absolute",
    width: TAB_ITEM_SIZE,
    height: TAB_ITEM_SIZE,
    borderRadius: TAB_ITEM_SIZE / 2,
    backgroundColor: SECONDARY_COLOR,
  },
});

export default CustomTabBar;
