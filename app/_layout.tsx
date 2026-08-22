import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';
import { ZagadajSessionProvider, useZagadajSession } from '../src/contexts/ZagadajSessionContext';
import { colors } from '../src/theme';

enableFreeze(true);
void SplashScreen.preventAutoHideAsync().catch(() => {});

function AppNavigator() {
  const { hydrated } = useZagadajSession();

  useEffect(() => {
    if (!hydrated) return;
    void SplashScreen.hideAsync().catch(() => {});
  }, [hydrated]);

  if (!hydrated) {
    return <View style={styles.bootstrap} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.bg },
          freezeOnBlur: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ZagadajSessionProvider>
        <View style={styles.root}>
          <AppNavigator />
        </View>
      </ZagadajSessionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  bootstrap: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
