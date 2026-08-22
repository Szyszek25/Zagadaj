import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Props = {
  completedSessions: number;
};

type Lesson = {
  title: string;
  subtitle: string;
  unlockAt: number;
};

const unitOne: Lesson[] = [
  { title: 'Podejście jest wygraną', subtitle: 'Dlaczego sam start jest ważniejszy niż wynik.', unlockAt: 0 },
  { title: 'Zasada trzech sekund', subtitle: 'Rusz zanim zacznie się overthinking.', unlockAt: 0 },
  { title: 'Większość ludzi też się stresuje', subtitle: 'Napięcie jest normalne i mięknie z powtórzeniami.', unlockAt: 1 },
  { title: 'Openery, które brzmią naturalnie', subtitle: 'Prosto, szczerze i łatwo do powiedzenia.', unlockAt: 2 },
  { title: 'Dobre wyjście z rozmowy', subtitle: 'Kończ ciepło i bez niezręcznego przeciągania.', unlockAt: 3 },
];

const unitTwo: Lesson[] = [
  { title: 'Jak zadać drugie pytanie', subtitle: 'Co zrobić po pierwszym „hej”.', unlockAt: 4 },
  { title: 'Czytanie energii rozmowy', subtitle: 'Kiedy zostać, kiedy odpuścić.', unlockAt: 5 },
  { title: 'Przejście do kontaktu', subtitle: 'Naturalne domknięcie bez presji.', unlockAt: 7 },
];

export function LearnScreen({ completedSessions }: Props) {
  const completed = Math.min(unitOne.length, Math.max(1, completedSessions + 1));
  const total = unitOne.length + unitTwo.length;

  const renderLesson = (lesson: Lesson, index: number, baseIndex = 0) => {
    const absoluteIndex = baseIndex + index;
    const unlocked = completedSessions >= lesson.unlockAt;
    const done = unlocked && absoluteIndex < completed;

    return (
      <View key={lesson.title} style={styles.lessonRow}>
        <View style={[styles.lessonIcon, done && styles.lessonIconDone, !unlocked && styles.lessonIconLocked]}>
          <Ionicons
            name={done ? 'checkmark' : unlocked ? 'book-outline' : 'lock-closed-outline'}
            size={20}
            color={done ? colors.white : unlocked ? colors.navy : colors.muted}
          />
        </View>
        <View style={styles.lessonCopy}>
          <Text style={[styles.lessonTitle, !unlocked && styles.lockedText]}>{lesson.title}</Text>
          <Text style={styles.lessonSubtitle}>{unlocked ? lesson.subtitle : `Odblokuje się po ${lesson.unlockAt} sesjach.`}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <Text style={styles.kicker}>LEARN</Text>
      <Text style={styles.hero}>Naucz się{`\n`}zagadywać.</Text>
      <Text style={styles.heroAccent}>Bez skryptów, które brzmią sztucznie.</Text>

      <View style={styles.progressHeader}>
        <View>
          <Text style={styles.sectionTitle}>Fundamenty</Text>
          <Text style={styles.sectionSubtitle}>Najpierw mindset, potem słowa.</Text>
        </View>
        <Text style={styles.progressValue}>{completed}/{total}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(8, (completed / total) * 100)}%` }]} />
      </View>

      <Text style={styles.unitLabel}>UNIT 1 · INNER GAME</Text>
      <View style={styles.lessonList}>{unitOne.map((lesson, index) => renderLesson(lesson, index))}</View>

      <View style={styles.unitDivider} />
      <Text style={styles.unitLabel}>UNIT 2 · PODTRZYMANIE ROZMOWY</Text>
      <View style={styles.lessonList}>{unitTwo.map((lesson, index) => renderLesson(lesson, index, unitOne.length))}</View>

      <View style={styles.bottomNote}>
        <Ionicons name="sparkles-outline" size={18} color={colors.rust} />
        <Text style={styles.bottomText}>Każda ukończona sesja odblokowuje kolejne fragmenty nauki.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.page, paddingTop: 8, paddingBottom: spacing.navHeight + 44 },
  kicker: { color: colors.rust, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.5 },
  hero: { marginTop: 8, color: colors.navy, fontFamily: fonts.bold, fontSize: 42, lineHeight: 44, letterSpacing: -1.5 },
  heroAccent: { color: colors.rust, fontFamily: fonts.bold, fontSize: 29, lineHeight: 32, letterSpacing: -0.9, marginTop: 2 },
  progressHeader: { marginTop: 38, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { color: colors.navy, fontFamily: fonts.bold, fontSize: 25, letterSpacing: -0.5 },
  sectionSubtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, marginTop: 3 },
  progressValue: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13 },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.line, marginTop: 16, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.navy, borderRadius: 2 },
  unitLabel: { color: colors.muted, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.4, marginTop: 30 },
  lessonList: { marginTop: 14 },
  lessonRow: { minHeight: 82, flexDirection: 'row', alignItems: 'center' },
  lessonIcon: { width: 52, height: 52, borderRadius: 16, borderWidth: 2, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  lessonIconDone: { backgroundColor: colors.navy },
  lessonIconLocked: { borderColor: colors.line, backgroundColor: colors.soft },
  lessonCopy: { flex: 1, paddingLeft: 16 },
  lessonTitle: { color: colors.navy, fontFamily: fonts.semibold, fontSize: 17, lineHeight: 21 },
  lessonSubtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17, marginTop: 4 },
  lockedText: { color: colors.muted },
  unitDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginTop: 14 },
  bottomNote: { marginTop: 30, flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: colors.soft, borderRadius: 18, padding: 16 },
  bottomText: { flex: 1, color: colors.muted, fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
});
