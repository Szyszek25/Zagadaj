import React, { useMemo, useState } from 'react';
import { Platform, StatusBar as RNStatusBar, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomNav, TabKey } from './src/components/BottomNav';
import { TodayScreen } from './src/screens/TodayScreen';
import { ReelsScreen } from './src/screens/ReelsScreen';
import { CoachScreen } from './src/screens/CoachScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { colors } from './src/theme';

export default function App() {
  const [tab, setTab] = useState<TabKey>('today');
  const [xp, setXp] = useState(620);
  const [challengeStarted, setChallengeStarted] = useState(false);

  const topInset = useMemo(
    () => (Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 44),
    [],
  );

  const startChallenge = () => {
    if (!challengeStarted) setXp((value) => value + 20);
    setChallengeStarted(true);
  };

  return (
    <View style={styles.app}>
      <StatusBar style={tab === 'reels' ? 'light' : 'dark'} />
      <View style={[styles.screen, { paddingTop: topInset }]}>
        {tab === 'today' && (
          <TodayScreen
            xp={xp}
            streak={7}
            started={challengeStarted}
            onStart={startChallenge}
          />
        )}
        {tab === 'reels' && <ReelsScreen />}
        {tab === 'coach' && <CoachScreen />}
        {tab === 'progress' && <ProgressScreen xp={xp} streak={7} />}
      </View>
      <BottomNav active={tab} onChange={setTab} dark={tab === 'reels'} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1 },
});
