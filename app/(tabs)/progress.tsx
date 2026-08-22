import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useZagadajSession } from '../../src/contexts/ZagadajSessionContext';
import { ProgressScreen } from '../../src/screens/ProgressScreen';
import { colors } from '../../src/theme';

export default function ProgressRoute() {
  const { xp, streak } = useZagadajSession();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ProgressScreen xp={xp} streak={streak} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
});
