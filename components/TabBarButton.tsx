import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

const icons = {
  home: (props: any) => <AntDesign name="home" size={24} {...props} />,
  profile: (props: any) => <AntDesign name="user" size={24} {...props} />,
};

export type RouteName = 'home' | 'profile';

interface TabBarButtonProps {
  isFocused: boolean;
  label: any;
  routeName: RouteName;
  color: string;
  onPress: () => void;
  onLongPress: () => void;
}

const TabBarButton = (props: TabBarButtonProps) => {
  const { isFocused, label, routeName, color } = props;

  const scale = useSharedValue(0);
  const backgroundColor = useSharedValue('transparent');

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      duration: 350,
    });
    backgroundColor.value = isFocused ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
  }, [scale, isFocused, backgroundColor]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
      fontSize: interpolate(scale.value, [0, 1], [11, 14]), // Menambahkan perubahan ukuran font
    };
  });

  const IconComponent = icons[routeName];
  if (!IconComponent) {
    console.warn(`No icon found for route: ${routeName}`);
    return null;
  }

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        <IconComponent color={color} />
      </Animated.View>
      <Animated.Text style={[{ color }, animatedTextStyle]}>{label}</Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default TabBarButton;
