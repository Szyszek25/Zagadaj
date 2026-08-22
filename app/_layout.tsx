import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ZagadajSessionProvider, useZagadajSession } from '../src/contexts/ZagadajSessionContext';
import { colors } from '../src/theme';

enableFreeze(true);
void SplashScreen.preventAutoHideAsync().catch(() => {});

function AppNavigator() {
  const { hydrated: sessionHydrated } = useZagadajSession();
  const { hydrated: authHydrated } = useAuth();
  const ready = sessionHydrated && authHydrated;

  useEffect(() => {
    if (!ready) return;
    void SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <View style={styles.bootstrap} />;

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
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="login" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: 'fade',
          contentStyle: { backgroundColor: colors.bg },
          freezeOnBlur: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="practice-session"
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <ZagadajSessionProvider>
          <View style={styles.root}>
            <AppNavigator />
          </View>
        </ZagadajSessionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bootstrap: { flex: 1, backgroundColor: colors.bg },
});
