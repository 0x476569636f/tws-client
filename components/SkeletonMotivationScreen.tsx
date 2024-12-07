import React from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MotivationSkeletonLoader: React.FC = () => {
  const insets = useSafeAreaInsets();

  const shimmerAnimation = useSharedValue(0);

  React.useEffect(() => {
    shimmerAnimation.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerAnimation.value,
      [0, 1],
      [-width, width],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const SkeletonItem = () => (
    <View className="mb-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Header Skeleton */}
      <View className="mb-3 flex-row items-center">
        <View className="mr-3 h-10 w-10 rounded-full bg-muted" />
        <View>
          <View className="bg-muted-foreground/30 mb-2 h-4 w-32 rounded" />
          <View className="bg-muted-foreground/30 h-3 w-20 rounded" />
        </View>
      </View>

      {/* Content Skeleton */}
      <View>
        <View className="bg-muted-foreground/30 mb-2 h-4 w-full rounded" />
        <View className="bg-muted-foreground/30 mb-2 h-4 w-3/4 rounded" />
      </View>

      {/* Footer Skeleton */}
      <View className="mt-3 flex-row items-center justify-between">
        <View className="bg-muted-foreground/30 h-3 w-20 rounded" />
        <View className="bg-muted-foreground/30 h-5 w-5 rounded" />
      </View>
    </View>
  );

  return (
    <View
      className="flex-1 bg-background px-4 pt-3"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
      {[1, 2, 3].map((_, index) => (
        <SkeletonItem key={index} />
      ))}

      {/* Shimmer Effect */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: width,
            opacity: 0.3,
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
};

export default MotivationSkeletonLoader;
