import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors } from '../../src/theme';
import { fonts } from '../../src/typography';

const iconNames = {
  index: ['layers-outline', 'layers'],
  progress: ['leaf-outline', 'leaf'],
  spots: ['map-outline', 'map'],
  learn: ['school-outline', 'school'],
  coach: ['chatbubble-ellipses-outline', 'chatbubble-ellipses'],
} as const;

const tabListeners = {
  tabPress: () => {
    void Haptics.selectionAsync().catch(() => {});
  },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { hydrated, signedIn, onboarded } = useAuth();
  const tabHeight = 58 + Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 4);

  if (!hydrated) return null;
  if (!signedIn) return <Redirect href="/login" />;
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={({ route }) => {
        const pair = iconNames[route.name as keyof typeof iconNames] ?? iconNames.index;
        return {
          headerShown: false,
          animation: 'shift',
          lazy: true,
          freezeOnBlur: false,
          tabBarHideOnKeyboard: true,
          sceneStyle: { backgroundColor: colors.bg },
          tabBarActiveTintColor: colors.navy,
          tabBarInactiveTintColor: '#8A857D',
          tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 10, marginTop: 1 },
          tabBarIconStyle: { marginTop: 4 },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={pair[focused ? 1 : 0]} color={color} size={focused ? 25 : 24} />
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
            borderTopColor: 'rgba(7,31,54,0.10)',
            backgroundColor: 'rgba(246,240,228,0.98)',
            elevation: 0,
            shadowColor: '#071F36',
            shadowOpacity: 0.06,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: -3 },
          },
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Deck' }} listeners={tabListeners} />
      <Tabs.Screen name="progress" options={{ title: 'Garden' }} listeners={tabListeners} />
      <Tabs.Screen name="spots" options={{ title: 'Spoty' }} listeners={tabListeners} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} listeners={tabListeners} />
      <Tabs.Screen name="coach" options={{ title: 'Coach' }} listeners={tabListeners} />
      <Tabs.Screen name="reels" options={{ href: null }} />
    </Tabs>
  );
}
