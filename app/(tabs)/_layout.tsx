import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useAppTheme } from '@/src/shared/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.gray[400],
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border.default,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="modules"
        options={{
          title: 'Roadmap',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
        }}
      />
      {/* Hide these tabs */}
      <Tabs.Screen
        name="practice"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="roadmap"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
