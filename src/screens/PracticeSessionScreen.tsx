import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useZagadajSession } from '../contexts/ZagadajSessionContext';
import { getChallenge, type ChallengeScope } from '../domain/challenges';
import {
  advanceQuestion,
  createPracticeSnapshot,
  formatPracticeClock,
  practiceProgress,
  practiceRewardForSeconds,
  previousQuestion,
  tickPractice,
  type PracticeSnapshot,
} from '../domain/practiceSession';
import { colors } from '../theme';
import { fonts } from '../typography';

function normalizeScope(value: string | string[] | undefined): ChallengeScope {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'campus' || raw === 'city') return raw;
  return 'today';
}

export function PracticeSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ scope?: string }>();
  const scope = normalizeScope(params.scope);
  const challenge = useMemo(() => getChallenge(scope), [scope]);
  const { finishPractice } = useZagadajSession();
  const [snapshot, setSnapshot] = useState<PracticeSnapshot>(() => ({
    ...createPracticeSnapshot(challenge.durationSeconds),
    status: 'running',
  }));
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const rewardedRef = useRef(false);

  const recordCompletion = (secondsSpent: number) => {
    if (rewardedRef.current) return earnedXp ?? 0;
    rewardedRef.current = true;
    const reward = finishPractice({
      scope,
      secondsSpent,
      questionsSeen: Math.min(challenge.questions.length, snapshot.questionIndex + 1),
    });
    setEarnedXp(reward);
    return reward;
  };

  useEffect(() => {
    if (snapshot.status !== 'running') return;
    const id = setInterval(() => setSnapshot((current) => tickPractice(current)), 1000);
    return () => clearInterval(id);
  }, [snapshot.status]);

  useEffect(() => {
    if (snapshot.status !== 'running') return;
    if (snapshot.remainingSeconds === challenge.durationSeconds) return;
    if (snapshot.remainingSeconds > 0 && snapshot.remainingSeconds % 60 === 0) {
      setSnapshot((current) => advanceQuestion(current, challenge.questions.length));
      void Haptics.selectionAsync().catch(() => {});
    }
  }, [challenge.durationSeconds, challenge.questions.length, snapshot.remainingSeconds, snapshot.status]);

  useEffect(() => {
    if (snapshot.status !== 'finished' || rewardedRef.current) return;
    recordCompletion(challenge.durationSeconds);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [challenge.durationSeconds, snapshot.status]);

  const finishEarly = () => {
    const secondsSpent = challenge.durationSeconds - snapshot.remainingSeconds;
    recordCompletion(secondsSpent);
    router.back();
  };

  const togglePause = () => {
    setSnapshot((current) => ({
      ...current,
      status: current.status === 'running' ? 'paused' : current.status === 'paused' ? 'running' : current.status,
    }));
    void Haptics.selectionAsync().catch(() => {});
  };

  const progress = practiceProgress(snapshot);
  const currentQuestion = challenge.questions[snapshot.questionIndex] ?? challenge.questions[0];
  const predictedReward = practiceRewardForSeconds(challenge.xp, challenge.durationSeconds - snapshot.remainingSeconds);

  if (snapshot.status === 'finished') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.completeWrap}>
          <View style={styles.completeIcon}>
            <Ionicons name="checkmark" size={34} color={colors.white} />
          </View>
          <Text style={styles.completeKicker}>SESJA UKOŃCZONA</Text>
          <Text style={styles.completeTitle}>Dobra robota.{`\n`}To było 5 minut praktyki.</Text>
          <Text style={styles.completeXp}>+{earnedXp ?? challenge.xp} XP</Text>
          <Text style={styles.completeBody}>
            Przeszedłeś przez {Math.min(challenge.questions.length, snapshot.questionIndex + 1)} tematów. Następnym razem zacznij od tego, który brzmiał najbardziej naturalnie.
          </Text>
          <Pressable
            onPress={() => router.replace('/(tabs)/progress')}
            accessibilityRole="button"
            style={({ pressed }) => [styles.completeCta, pressed && styles.pressed]}
          >
            <Text style={styles.completeCtaText}>Zobacz postęp</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </Pressable>
          <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={10}>
            <Text style={styles.completeSecondary}>Wróć na Dziś</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={finishEarly} hitSlop={12} accessibilityRole="button" accessibilityLabel="Zamknij sesję" style={styles.iconButton}>
          <Ionicons name="close" size={26} color={colors.ink} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.eyebrow}>{challenge.eyebrow}</Text>
          <Text style={styles.headerTitle}>Sesja rozmowy</Text>
        </View>
        <Pressable onPress={togglePause} hitSlop={12} accessibilityRole="button" accessibilityLabel={snapshot.status === 'paused' ? 'Wznów' : 'Pauza'} style={styles.iconButton}>
          <Ionicons name={snapshot.status === 'paused' ? 'play' : 'pause'} size={23} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.timerBlock}>
        <Text style={styles.timer}>{formatPracticeClock(snapshot.remainingSeconds)}</Text>
        <Text style={styles.timerCaption}>{snapshot.status === 'paused' ? 'pauza' : 'zostało'}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(2, progress * 100)}%` }]} />
        </View>
      </View>

      <View style={styles.questionBlock}>
        <View style={styles.questionMetaRow}>
          <Text style={styles.questionMeta}>PYTANIE {snapshot.questionIndex + 1}/{challenge.questions.length}</Text>
          <Text style={styles.autoLabel}>zmiana co ~1 min</Text>
        </View>
        <Text style={styles.question}>{currentQuestion}</Text>
        <Text style={styles.tip}>Nie musisz czytać tego słowo w słowo. Potraktuj pytanie jak kierunek rozmowy.</Text>
      </View>

      <View style={styles.rewardHint}>
        <Ionicons name="flash-outline" size={15} color={colors.teal} />
        <Text style={styles.rewardHintText}>{predictedReward > 0 ? `Masz już ${predictedReward} XP z tej sesji` : `Pełna sesja: +${challenge.xp} XP`}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => {
            setSnapshot((current) => previousQuestion(current, challenge.questions.length));
            void Haptics.selectionAsync().catch(() => {});
          }}
          accessibilityRole="button"
          accessibilityLabel="Poprzednie pytanie"
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
          <Text style={styles.secondaryText}>Wstecz</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setSnapshot((current) => advanceQuestion(current, challenge.questions.length));
            void Haptics.selectionAsync().catch(() => {});
          }}
          accessibilityRole="button"
          accessibilityLabel="Następne pytanie"
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
        >
          <Text style={styles.nextText}>Następne</Text>
          <Ionicons name="arrow-forward" size={21} color={colors.white} />
        </Pressable>
      </View>

      <Pressable onPress={finishEarly} style={styles.finishLink} hitSlop={10}>
        <Text style={styles.finishText}>Zakończ wcześniej</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  eyebrow: { color: colors.teal, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0.8 },
  headerTitle: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 15, marginTop: 2 },
  timerBlock: { alignItems: 'center', paddingTop: 38 },
  timer: { color: colors.ink, fontFamily: fonts.bold, fontSize: 58, lineHeight: 62, letterSpacing: -2.2, fontVariant: ['tabular-nums'] },
  timerCaption: { color: colors.muted, fontFamily: fonts.medium, fontSize: 13, marginTop: 3 },
  progressTrack: { width: '100%', height: 5, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden', marginTop: 24 },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.teal },
  questionBlock: { flex: 1, justifyContent: 'center', paddingVertical: 24 },
  questionMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  questionMeta: { color: colors.teal, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.65 },
  autoLabel: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11 },
  question: { color: colors.ink, fontFamily: fonts.bold, fontSize: 34, lineHeight: 39, letterSpacing: -0.9 },
  tip: { color: colors.muted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, marginTop: 20, maxWidth: 330 },
  rewardHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 12 },
  rewardHintText: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11 },
  controls: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 0.78, height: 54, borderRadius: 14, backgroundColor: colors.soft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  secondaryText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 15 },
  nextButton: { flex: 1.22, height: 54, borderRadius: 14, backgroundColor: colors.teal, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextText: { color: colors.white, fontFamily: fonts.bold, fontSize: 16 },
  finishLink: { alignItems: 'center', paddingVertical: 16 },
  finishText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13, textDecorationLine: 'underline' },
  completeWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  completeIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  completeKicker: { color: colors.teal, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.8 },
  completeTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 34, lineHeight: 39, textAlign: 'center', letterSpacing: -1, marginTop: 10 },
  completeXp: { color: colors.teal, fontFamily: fonts.bold, fontSize: 26, marginTop: 20 },
  completeBody: { color: colors.muted, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, textAlign: 'center', marginTop: 13, maxWidth: 330 },
  completeCta: { marginTop: 34, width: '100%', height: 56, borderRadius: 14, backgroundColor: colors.teal, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  completeCtaText: { color: colors.white, fontFamily: fonts.bold, fontSize: 17 },
  completeSecondary: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13, marginTop: 18, textDecorationLine: 'underline' },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
});
