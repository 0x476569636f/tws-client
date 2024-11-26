import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useColorScheme } from '~/lib/useColorScheme';
import { COLORS } from '~/theme/colors';
import TabBarButton, { RouteName } from '~/components/TabBarButton';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colorScheme } = useColorScheme();
  const primaryColor = COLORS[colorScheme].primary;
  const greyColor = COLORS[colorScheme].grey;
  const backgroundColor = COLORS[colorScheme].background;

  return (
    <View style={[styles.tabbar, { backgroundColor }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name as RouteName}
            color={isFocused ? primaryColor : greyColor}
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'static',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 0,
    paddingVertical: 5,
    borderRadius: 25,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default TabBar;
