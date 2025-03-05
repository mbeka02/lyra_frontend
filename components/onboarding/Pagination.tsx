import { View } from "react-native";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
const _dotContainer = 24;
const _dotSize = _dotContainer / 3;
const _activeDot = "#ffffff";
const _inactiveDot = "#aaa";
export function Pagination({
  selectedIndex,
  total,
}: {
  selectedIndex: number;
  total: number;
}) {
  const derivedValue = useDerivedValue(() =>
    withSpring(selectedIndex, {
      damping: 80,
      stiffness: 200,
    }),
  );
  return (
    <View className="flex-row mx-auto items-center">
      <PaginationIndicator animation={derivedValue} />
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} index={i} animation={derivedValue} />
      ))}
    </View>
  );
}
function PaginationIndicator({
  animation,
}: {
  animation: SharedValue<number>;
}) {
  const animatedStyles = useAnimatedStyle(() => ({
    width: _dotContainer + _dotContainer * animation.value,
  }));
  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#24AE7C",
          height: _dotContainer,
          width: _dotContainer,
          borderRadius: _dotContainer,
          position: "absolute",
          left: 0,
          top: 0,
        },
        animatedStyles,
      ]}
    ></Animated.View>
  );
}
function Dot({
  index,
  animation,
}: {
  index: number;
  animation: SharedValue<number>;
}) {
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animation.value,
      [index - 1, index, index + 1],
      [_inactiveDot, _activeDot, _activeDot],
    ),
  }));
  return (
    <View
      style={{
        width: _dotContainer,
        height: _dotContainer,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            width: _dotSize,
            height: _dotSize,
            borderRadius: _dotSize,
            backgroundColor: "#000",
          },
          animatedStyles,
        ]}
      ></Animated.View>
    </View>
  );
}
