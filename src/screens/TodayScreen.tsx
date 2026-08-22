import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stat } from '../components/Stat';
import { challengeScopes, getChallenge, type ChallengeScope } from '../domain/challenges';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Props = {
  xp: number;
  streak: number;
  started: boolean;
  scope: ChallengeScope;
  onScopeChange: (scope: ChallengeScope) => void;
  onStart: (scope: ChallengeScope) => void;
};

const scopeLabels: Record<ChallengeScope, string> = {
  today: 'Codzienność',
  campus: 'Uczelnia',
  city: 'Miasto',
};

const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

export function TodayScreen({ xp, streak, scope, onScopeChange, onStart }: Props) {
  const lastTapRef = useRef(0);
  const touchStartYRef = useRef(0);
  const challenge = getChallenge(scope);
  const index = Math.max(0, challengeScopes.findIndex((item) => item.key === scope));
  const tier = index + 1;

  const nextScope = useMemo(() => {
    const nextIndex = (index + 1) % challengeScopes.length;
    return challengeScopes[nextIndex]?.key ?? 'today';
  }, [index]);

  const skip = () => {
    onScopeChange(nextScope);
    void Haptics.selectionAsync().catch(() => {});
  };

  const handleCardPress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 330) {
      lastTapRef.current = 0;
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onStart(scope);
      return;
    }
    lastTapRef.current = now;
  };

  return (
    <View
      style={styles.screen}
      onTouchStart={(event) => {
        touchStartYRef.current = event.nativeEvent.pageY;
      }}
      onTouchEnd={(event) => {
        const distance = touchStartYRef.current - event.nativeEvent.pageY;
        if (distance > 62) skip();
      }}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Zagadaj</Text>
          <Text style={styles.deckLabel}>DECK · {scopeLabels[scope]}</Text>
        </View>
        <View style={styles.stats}>
          <Stat value={`${streak}d`} label="seria" />
          <Stat value={`${xp}`} label="xp" />
        </View>
      </View>

      <Pressable
        onPress={handleCardPress}
        accessibilityRole="button"
        accessibilityLabel={`Wyzwanie: ${challenge.opener}. Naciśnij dwa razy, aby przyjąć.`}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <Text style={styles.trial}>TRIAL № {String(index + 1).padStart(3, '0')} · TIER {tier}</Text>
          <View style={styles.tierDot} />
        </View>

        <View style={styles.challengeCopy}>
          <Text style={styles.eyebrow}>{challenge.eyebrow.toUpperCase()}</Text>
          <Text style={styles.openWith}>„{challenge.opener}”</Text>
          <Text style={styles.context}>{challenge.description} {challenge.accent}</Text>
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.accept}>♡  DOUBLE TAP TO ACCEPT</Text>
          <Text style={styles.skip}>↑  SWIPE UP TO SKIP</Text>
        </View>
      </Pressable>

      <View style={styles.footerRow}>
        <Pressable onPress={() => onStart(scope)} style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
          <Text style={styles.startText}>PRZYJMIJ WYZWANIE</Text>
        </Pressable>
        <Pressable onPress={skip} hitSlop={12}>
          <Text style={styles.nextText}>Następne →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 18 },
  header: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: colors.navy, fontFamily: fonts.bold, fontSize: 25, letterSpacing: -0.8 },
  deckLabel: { color: colors.muted, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.1, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 2 },
  card: { flex: 1, borderWidth: 2, borderColor: colors.navy, borderRadius: 34, paddingHorizontal: 27, paddingVertical: 26, justifyContent: 'space-between', backgroundColor: '#F2EDE5' },
  cardPressed: { transform: [{ scale: 0.995 }], opacity: 0.93 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trial: { color: colors.muted, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 2.1 },
  tierDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.rust },
  challengeCopy: { marginTop: 12 },
  eyebrow: { color: colors.rust, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.3, marginBottom: 16 },
  openWith: { color: colors.navy, fontFamily: serif, fontSize: 31, lineHeight: 41, letterSpacing: -0.3 },
  context: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, marginTop: 20, maxWidth: 285 },
  cardBottom: { alignItems: 'center', paddingBottom: 2 },
  accept: { color: colors.muted, fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 1.7 },
  skip: { color: colors.muted, fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 1.7, marginTop: 7 },
  footerRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 16 },
  startButton: { flex: 1, height: 46, borderRadius: 13, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  startText: { color: colors.white, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.7 },
  nextText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 12 },
  pressed: { opacity: 0.7 },
});
