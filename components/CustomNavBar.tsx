import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY_COLOR = "#24AE7C";
const SECONDARY_COLOR = "#ffffff";
const TAB_ITEM_SIZE = 42;

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) {
          return null;
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const rTabItemViewStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: withTiming(isFocused ? 1 : 0) }],
            opacity: withTiming(isFocused ? 1 : 0),
          };
        }, [isFocused]);

        const rIconStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: withTiming(isFocused ? 1.1 : 1) }],
          };
        }, [isFocused]);

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Animated.View style={[rTabItemViewStyle, styles.tabItemView]} />
            <Animated.View style={rIconStyle}>
              {getIcon(route.name, isFocused ? PRIMARY_COLOR : SECONDARY_COLOR)}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  function getIcon(name: string, color: string) {
    switch (name) {
      case "home":
        return <Ionicons name="home" size={26} color={color} />;
      case "calendar":
        return <Ionicons name="calendar" size={26} color={color} />;
      case "settings":
        return <Ionicons name="settings" size={26} color={color} />;
      default:
        return <Ionicons name="home" size={22} color={color} />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
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
