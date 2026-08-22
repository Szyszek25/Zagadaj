import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stat } from '../components/Stat';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Props = {
  xp: number;
  streak: number;
  challengeStarted: boolean;
};

const dayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Ndz'] as const;

const starters = [
  ['Naturalny komplement', '+20 XP'],
  ['Pytanie o kontekst', '+15 XP'],
  ['Lekki follow-up', '✓'],
];

export function ProgressScreen({ xp, streak, challengeStarted }: Props) {
  const router = useRouter();
  const completedDays = challengeStarted ? 5 : 4;
  const weeklyApproaches = challengeStarted ? 4 : 3;

  const openCoach = () => {
    void Haptics.selectionAsync().catch(() => {});
    router.navigate('/(tabs)/coach');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Postęp</Text>
        <View style={styles.stats} accessibilityLabel={`${streak} dni serii, ${xp} punktów`}>
          <Stat value={`${streak} dni`} label="seria" />
          <Stat value={`${xp}`} label="punkty" />
        </View>
      </View>

      <Text style={styles.weekTitle} accessibilityRole="header">Twój tydzień</Text>
      <Text style={styles.weekSub}>
        {challengeStarted ? 'Dzisiejsze wyzwanie już ruszyło.' : '4 dni z rzędu. Jest rytm.'}
      </Text>

      <View style={styles.days} accessibilityLabel={`${completedDays} aktywnych dni w tym tygodniu`}>
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

      <Text style={styles.metric}>{weeklyApproaches} zagadania</Text>
      <Text style={styles.metricSub}>w tym tygodniu</Text>
      <Text style={styles.note}>Najlepiej idzie Ci na uczelni i w kawiarni.</Text>

      <Text style={styles.sectionTitle} accessibilityRole="header">Odblokowane startery</Text>
      {starters.map(([name, meta], index) => (
        <View key={name}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{name}</Text>
            <Text style={[styles.rowMeta, index < 2 && styles.rowMetaAccent]}>{meta}</Text>
          </View>
          {index < starters.length - 1 && <View style={styles.rowDivider} />}
        </View>
      ))}

      <Text style={styles.nextTitle} accessibilityRole="header">Co dalej</Text>
      <Pressable
        onPress={openCoach}
        style={({ pressed }) => [styles.nextRow, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Przejdź do lekcji Podtrzymanie rozmowy w Coach"
      >
        <View style={styles.nextCopy}>
          <Text style={styles.nextName}>Podtrzymanie rozmowy</Text>
          <Text style={styles.nextMeta}>Następny krok, żeby rozmowa płynęła naturalnie.</Text>
        </View>
        <Text style={styles.nextArrow}>→</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 34 },
  header: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 31, letterSpacing: -0.8 },
  stats: { flexDirection: 'row', gap: 2 },
  weekTitle: { marginTop: 36, color: colors.ink, fontFamily: fonts.bold, fontSize: 28, letterSpacing: -0.7 },
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
  metric: { marginTop: 30, color: colors.ink, fontFamily: fonts.bold, fontSize: 32, letterSpacing: -0.9 },
  metricSub: { color: colors.muted, fontFamily: fonts.regular, fontSize: 16 },
  note: { marginTop: 14, color: colors.muted, fontFamily: fonts.regular, fontSize: 14 },
  sectionTitle: { marginTop: 40, color: colors.ink, fontFamily: fonts.bold, fontSize: 20 },
  row: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTitle: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16 },
  rowMeta: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13 },
  rowMetaAccent: { color: colors.teal },
  rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  nextTitle: { marginTop: 29, color: colors.ink, fontFamily: fonts.bold, fontSize: 20 },
  nextRow: { marginTop: 13, flexDirection: 'row', alignItems: 'center', paddingVertical: 9, minHeight: 52 },
  nextCopy: { flex: 1 },
  nextName: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 17 },
  nextMeta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, marginTop: 3 },
  nextArrow: { color: colors.teal, fontFamily: fonts.semibold, fontSize: 22, marginLeft: 10 },
  pressed: { opacity: 0.6 },
});
