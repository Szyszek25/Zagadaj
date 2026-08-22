import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stat } from '../components/Stat';
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

const dayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Ndz'] as const;
const starters = [
  ['Naturalny komplement', '+20 XP'],
  ['Pytanie o kontekst', '+15 XP'],
  ['Lekki follow-up', '✓'],
];

export function ProgressScreen({
  xp,
  streak,
  challengeStarted,
  completedSessions,
  totalPracticeSeconds,
  userName,
  onOpenCoach,
  onSignOut,
}: Props) {
  const completedDays = challengeStarted ? 5 : 4;
  const weeklyApproaches = challengeStarted ? 4 : 3;
  const minutes = Math.floor(totalPracticeSeconds / 60);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Postęp</Text>
          {userName ? <Text style={styles.hello}>Hej, {userName}</Text> : null}
        </View>
        <View style={styles.stats}>
          <Stat value={`${streak} dni`} label="seria" />
          <Stat value={`${xp}`} label="punkty" />
        </View>
      </View>

      <Text style={styles.weekTitle}>Twój tydzień</Text>
      <Text style={styles.weekSub}>{challengeStarted ? 'Dzisiejsze wyzwanie już ruszyło.' : '4 dni z rzędu. Jest rytm.'}</Text>

      <View style={styles.days}>
        {dayLabels.map((label, index) => {
          const done = index < completedDays;
          const current = index === 4;
          return (
            <View key={label} style={styles.day}>
              <Text style={[styles.dayLabel, current && styles.dayLabelCurrent]}>{label}</Text>
              <View style={[styles.dayCircle, done && styles.dayDone, current && styles.dayCurrent]}>
                <Text style={[styles.dayValue, done && styles.dayValueDone]}>{done ? '✓' : index + 1}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.divider} />

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metric}>{weeklyApproaches}</Text>
          <Text style={styles.metricLabel}>zagadania</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metric}>{completedSessions}</Text>
          <Text style={styles.metricLabel}>sesje</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metric}>{minutes}</Text>
          <Text style={styles.metricLabel}>min ćwiczeń</Text>
        </View>
      </View>
      <Text style={styles.note}>Najlepiej idzie Ci na uczelni i w kawiarni. Kolejny krok: utrzymać rozmowę po pierwszym zdaniu.</Text>

      <Text style={styles.sectionTitle}>Odblokowane startery</Text>
      {starters.map(([name, meta], index) => (
        <View key={name}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{name}</Text>
            <Text style={[styles.rowMeta, index < 2 && styles.rowMetaAccent]}>{meta}</Text>
          </View>
          {index < starters.length - 1 && <View style={styles.rowDivider} />}
        </View>
      ))}

      <Text style={styles.nextTitle}>Co dalej</Text>
      <Pressable
        onPress={onOpenCoach}
        accessibilityRole="button"
        accessibilityLabel="Przejdź do Coacha: podtrzymanie rozmowy"
        style={({ pressed }) => [styles.nextRow, pressed && styles.pressed]}
      >
        <View style={styles.nextCopy}>
          <Text style={styles.nextName}>Podtrzymanie rozmowy</Text>
          <Text style={styles.nextMeta}>Następny krok, żeby rozmowa płynęła naturalnie.</Text>
        </View>
        <Ionicons name="arrow-forward" color={colors.teal} size={22} />
      </Pressable>

      <View style={styles.accountDivider} />
      <Pressable onPress={onSignOut} hitSlop={10} accessibilityRole="button" style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}>
        <Ionicons name="log-out-outline" size={18} color={colors.muted} />
        <Text style={styles.signOutText}>Wyloguj / przetestuj onboarding od nowa</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 45 },
  header: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 31, letterSpacing: -0.8 },
  hello: { color: colors.muted, fontFamily: fonts.medium, fontSize: 12, marginTop: 1 },
  stats: { flexDirection: 'row', gap: 2 },
  weekTitle: { marginTop: 34, color: colors.ink, fontFamily: fonts.bold, fontSize: 28, letterSpacing: -0.7 },
  weekSub: { marginTop: 3, color: colors.muted, fontFamily: fonts.regular, fontSize: 14 },
  days: { marginTop: 24, flexDirection: 'row', justifyContent: 'space-between' },
  day: { width: 40, alignItems: 'center' },
  dayLabel: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 10 },
  dayLabelCurrent: { color: colors.ink },
  dayCircle: { marginTop: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: colors.tealSoft },
  dayCurrent: { transform: [{ scale: 1.06 }] },
  dayValue: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13 },
  dayValueDone: { color: colors.teal, fontFamily: fonts.bold, fontSize: 14 },
  divider: { marginTop: 25, height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  metricsRow: { marginTop: 28, flexDirection: 'row', justifyContent: 'space-between' },
  metricItem: { flex: 1 },
  metric: { color: colors.ink, fontFamily: fonts.bold, fontSize: 29, letterSpacing: -0.8 },
  metricLabel: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11, marginTop: 1 },
  note: { marginTop: 16, color: colors.muted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  sectionTitle: { marginTop: 36, color: colors.ink, fontFamily: fonts.bold, fontSize: 20 },
  row: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTitle: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16 },
  rowMeta: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13 },
  rowMetaAccent: { color: colors.teal },
  rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  nextTitle: { marginTop: 27, color: colors.ink, fontFamily: fonts.bold, fontSize: 20 },
  nextRow: { marginTop: 11, flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  nextCopy: { flex: 1, paddingRight: 10 },
  nextName: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 17 },
  nextMeta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 3 },
  accountDivider: { marginTop: 28, height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  signOut: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 8 },
  signOutText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13 },
  pressed: { opacity: 0.6 },
});
