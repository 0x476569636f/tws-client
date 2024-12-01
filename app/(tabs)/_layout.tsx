import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '~/components/TabBar';

const _layout = () => {
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
