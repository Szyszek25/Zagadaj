import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useZagadajSession } from '../../src/contexts/ZagadajSessionContext';
import { TodayScreen } from '../../src/screens/TodayScreen';
import { colors } from '../../src/theme';

export default function TodayRoute() {
  const { xp, streak, challengeStarted, startChallenge } = useZagadajSession();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <TodayScreen
        xp={xp}
        streak={streak}
        started={challengeStarted}
        onStart={startChallenge}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
});
