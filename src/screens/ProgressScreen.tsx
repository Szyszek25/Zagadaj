import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GardenScene } from '../components/GardenScene';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Props = {
  xp: number;
  streak: number;
  challengeStarted: boolean;
  completedSessions: number;
  totalPracticeSeconds: number;
  userName?: string | null;
  onOpenCoach: () => void;
  onSignOut: () => void;
};

export function ProgressScreen({
  xp,
  streak,
  completedSessions,
  totalPracticeSeconds,
  userName,
  onOpenCoach,
  onSignOut,
}: Props) {
  const minutes = Math.floor(totalPracticeSeconds / 60);
  const gardenLevel = Math.min(6, completedSessions);
  const lessons = Math.min(8, Math.max(1, completedSessions + 1));
  const rewardName = completedSessions >= 5 ? 'Kamienny krąg' : completedSessions >= 2 ? 'Drugie drzewo' : 'Pierwsze drzewo';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>GARDEN</Text>
          <Text style={styles.hero}>Buduj prawdziwą{`\n`}pewność siebie.</Text>
          {userName ? <Text style={styles.hello}>Twój ogród, {userName}.</Text> : null}
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{streak}d</Text>
          <Text style={styles.metricLabel}>MILESTONE</Text>
          <Text style={styles.metricHint}>seria</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{completedSessions}</Text>
          <Text style={styles.metricLabel}>APPROACHES</Text>
          <Text style={styles.metricHint}>wykonane</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{lessons}/8</Text>
          <Text style={styles.metricLabel}>LESSONS</Text>
          <Text style={styles.metricHint}>odblokowane</Text>
        </View>
      </View>

      <GardenScene level={gardenLevel} />

      <View style={styles.daysBlock}>
        <Text style={styles.days}>{streak}</Text>
        <Text style={styles.daysLabel}>DAYS IN MOTION</Text>
        <Text style={styles.daysTime}>{minutes} min realnej praktyki · {xp} XP</Text>
      </View>

      <View style={styles.rewardCard}>
        <View style={styles.rewardTop}>
          <Text style={styles.rewardKicker}>NOWE W TWOIM OGRODZIE</Text>
          <Ionicons name="leaf-outline" size={17} color={colors.garden} />
        </View>
        <Text style={styles.rewardTitle}>{rewardName}</Text>
        <Text style={styles.rewardText}>Pojawia się dzięki wykonanym podejściom. Nawet jeśli wynik rozmowy nie był idealny, sam ruch zostaje w Garden.</Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightKicker}>NASTĘPNY KROK</Text>
        <Text style={styles.insightTitle}>Po pierwszym „hej” zostań jeszcze chwilę.</Text>
        <Text style={styles.insightBody}>Coach pomoże Ci przećwiczyć drugie pytanie i naturalne wyjście z rozmowy.</Text>
        <Pressable onPress={onOpenCoach} style={({ pressed }) => [styles.coachButton, pressed && styles.pressed]}>
          <Text style={styles.coachButtonText}>Otwórz Coacha</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </Pressable>
      </View>

      <Pressable onPress={onSignOut} hitSlop={10} style={styles.signOut}>
        <Ionicons name="log-out-outline" size={17} color={colors.muted} />
        <Text style={styles.signOutText}>Wyloguj / przejdź onboarding od nowa</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.page, paddingTop: 8, paddingBottom: spacing.navHeight + 46 },
  header: { marginBottom: 28 },
  kicker: { color: colors.rust, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.5 },
  hero: { marginTop: 8, color: colors.navy, fontFamily: fonts.bold, fontSize: 38, lineHeight: 40, letterSpacing: -1.25 },
  hello: { color: colors.muted, fontFamily: fonts.medium, fontSize: 13, marginTop: 8 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { color: colors.navy, fontFamily: fonts.bold, fontSize: 24, letterSpacing: -0.5 },
  metricLabel: { color: colors.muted, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.4, marginTop: 4 },
  metricHint: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, marginTop: 2 },
  daysBlock: { alignItems: 'center', paddingVertical: 24 },
  days: { color: colors.navy, fontFamily: fonts.bold, fontSize: 40, letterSpacing: -1 },
  daysLabel: { color: colors.navy, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 3, marginTop: 2 },
  daysTime: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 7 },
  rewardCard: { borderWidth: 1.5, borderColor: colors.garden, borderRadius: 18, padding: 17, backgroundColor: '#F8F3E8' },
  rewardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rewardKicker: { color: colors.garden, fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 1.4 },
  rewardTitle: { color: colors.navy, fontFamily: fonts.bold, fontSize: 21, marginTop: 9 },
  rewardText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, marginTop: 7 },
  insightCard: { marginTop: 16, borderRadius: 20, backgroundColor: colors.navy, padding: 19 },
  insightKicker: { color: '#D6C4B8', fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.2 },
  insightTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 22, lineHeight: 27, marginTop: 8 },
  insightBody: { color: 'rgba(255,252,246,0.72)', fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, marginTop: 7 },
  coachButton: { height: 48, borderRadius: 13, backgroundColor: colors.rust, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 17 },
  coachButtonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 14 },
  signOut: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 },
  signOutText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 12 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
});
