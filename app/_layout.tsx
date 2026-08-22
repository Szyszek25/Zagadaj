import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';
import { ZagadajSessionProvider } from '../src/contexts/ZagadajSessionContext';
import { colors } from '../src/theme';

enableFreeze(true);

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ZagadajSessionProvider>
        <View style={styles.root}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'fade',
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
});
