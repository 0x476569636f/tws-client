import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import TabBar from '~/components/TabBar';

import { useColorScheme } from '~/lib/useColorScheme';
import { Appearance } from 'react-native';

const _layout = () => {
  const { setColorScheme, colorScheme } = useColorScheme();

  // Idk but this fix my tab bar position
  useEffect(() => {
    setColorScheme(colorScheme ?? 'light');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme ?? 'light');
    });

    return () => {
      subscription.remove();
    };
  }, [setColorScheme]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cari Berita',
        }}
      />
      <Tabs.Screen
        name="motivation"
        options={{
          title: 'Motivasi',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil Saya',
        }}
      />
    </Tabs>
  );
};

export default _layout;
