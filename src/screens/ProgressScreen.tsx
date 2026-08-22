import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stat } from '../components/Stat';
import { colors, spacing } from '../theme';

type Props = { xp: number; streak: number };

const days = [
  ['Pon', true],
  ['Wt', true],
  ['Śr', true],
  ['Czw', true],
  ['Pt', false],
  ['Sb', false],
  ['Ndz', false],
] as const;

const starters = [
  ['Naturalny komplement', '+20 XP'],
  ['Pytanie o kontekst', '+15 XP'],
  ['Lekki follow-up', '✓'],
];

export function ProgressScreen({ xp, streak }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Postęp</Text>
        <View style={styles.stats}>
          <Stat value={`${streak} dni`} label="seria" />
          <Stat value={`${xp}`} label="punkty" />
        </View>
      </View>

      <Text style={styles.weekTitle}>Twój tydzień</Text>
      <Text style={styles.weekSub}>4 dni z rzędu. Jest rytm.</Text>

      <View style={styles.days}>
        {days.map(([label, done], index) => (
          <View key={label} style={styles.day}>
            <Text style={styles.dayLabel}>{label}</Text>
            <View style={[styles.dayCircle, done && styles.dayDone]}>
              <Text style={[styles.dayValue, done && styles.dayValueDone]}>{done ? '✓' : index + 1}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.divider} />
      <Text style={styles.metric}>3 zagadania</Text>
      <Text style={styles.metricSub}>w tym tygodniu</Text>
      <Text style={styles.note}>Najlepiej idzie Ci na uczelni i w kawiarni.</Text>

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
      <Pressable style={({ pressed }) => [styles.nextRow, pressed && styles.pressed]}>
        <View style={{ flex: 1 }}>
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
  content: { paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 28 },
  header: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  stats: { flexDirection: 'row', gap: 2 },
  weekTitle: { marginTop: 34, color: colors.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.7 },
  weekSub: { marginTop: 2, color: colors.muted, fontSize: 14 },
  days: { marginTop: 22, flexDirection: 'row', justifyContent: 'space-between' },
  day: { width: 40, alignItems: 'center' },
  dayLabel: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  dayCircle: { marginTop: 11, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: colors.tealSoft },
  dayValue: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  dayValueDone: { color: colors.teal, fontSize: 14, fontWeight: '800' },
  divider: { marginTop: 24, height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  metric: { marginTop: 28, color: colors.ink, fontSize: 31, fontWeight: '800', letterSpacing: -0.9 },
  metricSub: { color: colors.muted, fontSize: 16 },
  note: { marginTop: 14, color: colors.muted, fontSize: 14 },
  sectionTitle: { marginTop: 38, color: colors.ink, fontSize: 20, fontWeight: '700' },
  row: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTitle: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  rowMeta: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  rowMetaAccent: { color: colors.teal },
  rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  nextTitle: { marginTop: 26, color: colors.ink, fontSize: 20, fontWeight: '700' },
  nextRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  nextName: { color: colors.ink, fontSize: 17, fontWeight: '600' },
  nextMeta: { color: colors.muted, fontSize: 12, marginTop: 3 },
  nextArrow: { color: colors.teal, fontSize: 22, marginLeft: 10 },
  pressed: { opacity: 0.6 },
});
