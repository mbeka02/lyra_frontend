import { Button } from "../ui/button";
import Animated, {
  AnimatedProps,
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { ButtonProps } from "../ui/button";
const AnimatedButton = Animated.createAnimatedComponent(Button);

const _layoutTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);

export function FormButton({
  children,
  className,
  onPress,
}: AnimatedProps<ButtonProps>) {
  return (
    <AnimatedButton
      className={className}
      entering={FadeInLeft.springify().damping(80).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
      layout={_layoutTransition}
      onPress={onPress}
    >
      {children}
    </AnimatedButton>
  );
}
