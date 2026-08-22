import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { useZagadajSession } from '../../src/contexts/ZagadajSessionContext';
import { ProgressScreen } from '../../src/screens/ProgressScreen';
import { colors } from '../../src/theme';

export default function ProgressRoute() {
  const router = useRouter();
  const { xp, streak, challengeStarted, completedSessions, totalPracticeSeconds } = useZagadajSession();
  const { profile, signOut } = useAuth();

  const logout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ProgressScreen
        xp={xp}
        streak={streak}
        challengeStarted={challengeStarted}
        completedSessions={completedSessions}
        totalPracticeSeconds={totalPracticeSeconds}
        userName={profile?.name}
        onOpenCoach={() => router.push('/(tabs)/coach')}
        onSignOut={() => void logout()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
});
