import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme';
import { fonts } from '../../src/typography';

const iconNames = {
  index: ['home-outline', 'home'],
  reels: ['play-circle-outline', 'play-circle'],
  coach: ['chatbubble-ellipses-outline', 'chatbubble-ellipses'],
  progress: ['stats-chart-outline', 'stats-chart'],
} as const;

const tabListeners = {
  tabPress: () => {
    void Haptics.selectionAsync().catch(() => {});
  },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabHeight = 54 + Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 4);

  return (
    <Tabs
      screenOptions={({ route }) => {
        const dark = route.name === 'reels';
        const pair = iconNames[route.name as keyof typeof iconNames] ?? iconNames.index;

        return {
          headerShown: false,
          animation: 'shift',
          lazy: false,
          freezeOnBlur: false,
          tabBarHideOnKeyboard: true,
          sceneStyle: {
            backgroundColor: dark ? colors.black : colors.bg,
          },
          tabBarActiveTintColor: colors.teal,
          tabBarInactiveTintColor: dark ? '#A6ADB0' : '#111111',
          tabBarLabelStyle: {
            fontFamily: fonts.semibold,
            fontSize: 11,
            marginTop: 1,
          },
          tabBarIconStyle: {
            marginTop: 3,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={pair[focused ? 1 : 0]}
              color={color}
              size={focused ? 26 : 25}
            />
          ),
          tabBarStyle: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: tabHeight,
            paddingTop: 2,
            paddingBottom: Math.max(insets.bottom, 4),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            backgroundColor: dark ? 'rgba(8,9,9,0.96)' : 'rgba(255,255,255,0.98)',
            elevation: 0,
            shadowColor: '#000',
            shadowOpacity: dark ? 0 : 0.05,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: -3 },
          },
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dziś' }} listeners={tabListeners} />
      <Tabs.Screen name="reels" options={{ title: 'Rolki' }} listeners={tabListeners} />
      <Tabs.Screen name="coach" options={{ title: 'Coach' }} listeners={tabListeners} />
      <Tabs.Screen name="progress" options={{ title: 'Postęp' }} listeners={tabListeners} />
    </Tabs>
  );
}
