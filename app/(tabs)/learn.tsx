import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useZagadajSession } from '../../src/contexts/ZagadajSessionContext';
import { LearnScreen } from '../../src/screens/LearnScreen';
import { colors } from '../../src/theme';

export default function LearnRoute() {
  const { completedSessions } = useZagadajSession();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <LearnScreen completedSessions={completedSessions} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.bg } });
