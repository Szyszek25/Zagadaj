import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme';
import { fonts } from '../../src/typography';

const icons: Record<string, string> = {
  index: '●',
  reels: '▶',
  coach: '✦',
  progress: '▥',
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabHeight = 54 + Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 4);

  return (
    <Tabs
      screenOptions={({ route }) => {
        const dark = route.name === 'reels';
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
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarIcon: ({ color, focused }) => (
            <Text
              style={[
                styles.icon,
                { color },
                focused && styles.iconFocused,
              ]}
            >
              {icons[route.name] ?? '•'}
            </Text>
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
      <Tabs.Screen name="index" options={{ title: 'Dziś' }} />
      <Tabs.Screen name="reels" options={{ title: 'Rolki' }} />
      <Tabs.Screen name="coach" options={{ title: 'Coach' }} />
      <Tabs.Screen name="progress" options={{ title: 'Postęp' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    transform: [{ scale: 0.96 }],
  },
  iconFocused: {
    transform: [{ scale: 1.06 }],
  },
});
