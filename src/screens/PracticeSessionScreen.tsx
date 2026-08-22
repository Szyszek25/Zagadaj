import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useZagadajSession } from '../contexts/ZagadajSessionContext';
import { getChallenge, type ChallengeScope } from '../domain/challenges';
import {
  advanceQuestion,
  createPracticeDeadline,
  createPracticeSnapshot,
  elapsedPracticeMinute,
  formatPracticeClock,
  practiceRewardForSeconds,
  syncPracticeToDeadline,
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
  const deadlineRef = useRef(createPracticeDeadline(Date.now(), challenge.durationSeconds));
  const lastAutoMinuteRef = useRef(0);

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

  const synchronizeClock = () => {
    if (snapshot.status !== 'running') return;
    setSnapshot((current) => syncPracticeToDeadline(current, deadlineRef.current, Date.now()));
  };

  useEffect(() => {
    if (snapshot.status !== 'running') return;
    const id = setInterval(() => {
      setSnapshot((current) => syncPracticeToDeadline(current, deadlineRef.current, Date.now()));
    }, 250);
    return () => clearInterval(id);
  }, [snapshot.status]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') synchronizeClock();
    });
    return () => subscription.remove();
  }, [snapshot.status]);

  useEffect(() => {
    if (snapshot.status !== 'running') return;
    const elapsedMinute = elapsedPracticeMinute(snapshot);
    if (elapsedMinute <= lastAutoMinuteRef.current) return;
    const steps = elapsedMinute - lastAutoMinuteRef.current;
    lastAutoMinuteRef.current = elapsedMinute;
    setSnapshot((current) => advanceQuestion(current, challenge.questions.length, steps));
    void Haptics.selectionAsync().catch(() => {});
  }, [challenge.questions.length, snapshot.remainingSeconds, snapshot.status]);

  useEffect(() => {
    if (snapshot.status !== 'finished' || rewardedRef.current) return;
    recordCompletion(challenge.durationSeconds);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [challenge.durationSeconds, snapshot.status]);

  const markComplete = () => {
    const secondsSpent = Math.max(20, challenge.durationSeconds - snapshot.remainingSeconds);
    recordCompletion(secondsSpent);
    setSnapshot((current) => ({ ...current, status: 'finished' }));
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const giveUp = () => {
    void Haptics.selectionAsync().catch(() => {});
    router.back();
  };

  const togglePause = () => {
    setSnapshot((current) => {
      if (current.status === 'running') {
        const synced = syncPracticeToDeadline(current, deadlineRef.current, Date.now());
        return { ...synced, status: synced.remainingSeconds === 0 ? 'finished' : 'paused' };
      }
      if (current.status === 'paused') {
        deadlineRef.current = createPracticeDeadline(Date.now(), current.remainingSeconds);
        return { ...current, status: 'running' };
      }
      return current;
    });
    void Haptics.selectionAsync().catch(() => {});
  };

  const currentQuestion = challenge.questions[snapshot.questionIndex] ?? challenge.questions[0];
  const predictedReward = practiceRewardForSeconds(challenge.xp, challenge.durationSeconds - snapshot.remainingSeconds);

  if (snapshot.status === 'finished') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.completeWrap}>
          <View style={styles.completeIcon}>
            <Ionicons name="checkmark" size={34} color={colors.white} />
          </View>
          <Text style={styles.completeKicker}>APPROACH COMPLETE</Text>
          <Text style={styles.completeTitle}>To się liczy.{`\n`}Nie reakcja drugiej osoby.</Text>
          <Text style={styles.completeXp}>+{earnedXp ?? challenge.xp} XP</Text>
          <Text style={styles.completeBody}>Każde podejście rozbudowuje Twój Garden i odblokowuje kolejne lekcje.</Text>
          <Pressable onPress={() => router.replace('/(tabs)/progress')} style={({ pressed }) => [styles.completeCta, pressed && styles.pressed]}>
            <Text style={styles.completeCtaText}>Zobacz Garden</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </Pressable>
          <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={10}>
            <Text style={styles.completeSecondary}>Wróć do Decku</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.top}>
        <View style={styles.header}>
          <Pressable onPress={giveUp} hitSlop={12} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={25} color={colors.navy} />
          </Pressable>
          <Text style={styles.headerLabel}>ACTIVE CHALLENGE</Text>
          <Pressable onPress={togglePause} hitSlop={12} style={styles.iconButton}>
            <Ionicons name={snapshot.status === 'paused' ? 'play' : 'pause'} size={21} color={colors.navy} />
          </Pressable>
        </View>

        <View style={styles.promptWrap}>
          <Text style={styles.challengeLine}>„{challenge.opener}”</Text>
          <Text style={styles.questionLabel}>JEŚLI ROZMOWA RUSZY</Text>
          <Text style={styles.question}>{currentQuestion}</Text>
          <Pressable
            onPress={() => setSnapshot((current) => advanceQuestion(current, challenge.questions.length))}
            hitSlop={10}
          >
            <Text style={styles.nextQuestion}>Następne pytanie →</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.timerStage}>
        <Text style={styles.timer}>{formatPracticeClock(snapshot.remainingSeconds)}</Text>
        <Text style={styles.status}>{snapshot.status === 'paused' ? 'PAUZA' : `W RUCHU · ${predictedReward}/${challenge.xp} XP`}</Text>

        <View style={styles.actions}>
          <Pressable onPress={markComplete} style={({ pressed }) => [styles.completeButton, pressed && styles.pressed]}>
            <Text style={styles.completeButtonText}>OZNACZ JAKO ZROBIONE</Text>
          </Pressable>
          <Pressable onPress={giveUp} hitSlop={12}>
            <Text style={styles.giveUp}>PODDAJĘ SIĘ</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { flex: 1.04, paddingHorizontal: 20 },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerLabel: { color: colors.muted, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.3 },
  promptWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 12, paddingBottom: 22 },
  challengeLine: { color: colors.navy, fontFamily: fonts.semibold, fontSize: 27, lineHeight: 35, textAlign: 'center', letterSpacing: -0.5 },
  questionLabel: { color: colors.rust, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.2, textAlign: 'center', marginTop: 30 },
  question: { color: colors.muted, fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8, paddingHorizontal: 14 },
  nextQuestion: { color: colors.navy, fontFamily: fonts.semibold, fontSize: 11, textAlign: 'center', marginTop: 13 },
  timerStage: { flex: 0.96, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, paddingBottom: 24, paddingHorizontal: 20, borderTopLeftRadius: 42, borderTopRightRadius: 42 },
  timer: { color: colors.bg, fontFamily: fonts.bold, fontSize: 104, lineHeight: 120, letterSpacing: -5, fontVariant: ['tabular-nums'], marginTop: -42 },
  status: { color: 'rgba(246,240,228,0.62)', fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.25, marginTop: -14 },
  actions: { width: '100%', alignItems: 'center', gap: 18 },
  completeButton: { width: '100%', height: 56, borderRadius: 4, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  completeButtonText: { color: colors.navy, fontFamily: fonts.bold, fontSize: 12, letterSpacing: 0.65 },
  giveUp: { color: 'rgba(246,240,228,0.72)', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.8 },
  completeWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28, backgroundColor: colors.bg },
  completeIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  completeKicker: { color: colors.rust, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.2 },
  completeTitle: { color: colors.navy, fontFamily: fonts.bold, fontSize: 35, lineHeight: 39, textAlign: 'center', letterSpacing: -1, marginTop: 10 },
  completeXp: { color: colors.rust, fontFamily: fonts.bold, fontSize: 27, marginTop: 20 },
  completeBody: { color: colors.muted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 12, maxWidth: 320 },
  completeCta: { marginTop: 32, width: '100%', height: 56, borderRadius: 14, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  completeCtaText: { color: colors.white, fontFamily: fonts.bold, fontSize: 16 },
  completeSecondary: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13, marginTop: 18 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
});
