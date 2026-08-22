import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useZagadajSession } from '../../src/contexts/ZagadajSessionContext';
import type { ChallengeScope } from '../../src/domain/challenges';
import { TodayScreen } from '../../src/screens/TodayScreen';
import { colors } from '../../src/theme';

export default function TodayRoute() {
  const router = useRouter();
  const { xp, streak, challengeStarted, startChallenge } = useZagadajSession();
  const [scope, setScope] = useState<ChallengeScope>('today');

  const start = (nextScope: ChallengeScope) => {
    startChallenge();
    router.push({ pathname: '/practice-session', params: { scope: nextScope } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <TodayScreen
        xp={xp}
        streak={streak}
        started={challengeStarted}
        scope={scope}
        onScopeChange={setScope}
        onStart={start}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
});
