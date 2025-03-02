import { Skeleton } from "~/components/ui/skeleton";
import { View } from "react-native";
import { cn } from "~/lib/utils";
interface SkeletonLoaderProps {
  count?: number;
  skeletonStlyes: string;
  containerStyles: string;
}
export const SkeletonLoader = ({
  count = 2,
  skeletonStlyes,
  containerStyles,
}: SkeletonLoaderProps) => {
  return (
    <View className={cn("flex-1", containerStyles)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={skeletonStlyes} />
      ))}
    </View>
  );
};
