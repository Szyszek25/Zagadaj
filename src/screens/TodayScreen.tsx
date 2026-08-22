import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stat } from '../components/Stat';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Props = {
  xp: number;
  streak: number;
  started: boolean;
  onStart: () => void;
};

const variants = [
  'Hej, totalnie znikąd, ale masz bardzo dobrą energię.',
  'Hej, szybkie pytanie — często tu wpadasz?',
  'Hej, wyglądasz jak ktoś, kto zna tu dobre miejsca. Co polecasz?',
];

export function TodayScreen({ xp, streak, started, onStart }: Props) {
  const [variant, setVariant] = useState(0);

  const easier = () => setVariant((value) => (value + 1) % variants.length);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>Zagadaj</Text>
          <View style={styles.brandDot} />
        </View>
        <View style={styles.stats}>
          <Stat value={`${streak} dni`} label="seria" />
          <Stat value={`${xp}`} label="punkty" />
        </View>
      </View>

      <View style={styles.tabs}>
        <View>
          <Text style={[styles.tab, styles.tabActive]}>Dziś</Text>
          <View style={styles.tabLine} />
        </View>
        <Text style={styles.tab}>Na uczelni</Text>
        <Text style={styles.tab}>W mieście</Text>
      </View>

      <Text style={styles.kicker}>DZIŚ</Text>
      <Text style={styles.title}>Dzisiejsze{`\n`}wyzwanie</Text>
      <Text style={styles.description}>
        Zagadaj dziś do 1 osoby,{`\n`}z którą złapiesz{' '}
        <Text style={styles.accent}>naturalny vibe.</Text>
      </Text>

      <View style={styles.opener}>
        <Text style={styles.quote}>“</Text>
        <Text style={styles.openerText}>{variants[variant]}</Text>
      </View>

      <Text style={styles.support}>Nie chodzi o ideał. Wystarczy zacząć.</Text>

      <Pressable
        onPress={onStart}
        style={({ pressed }) => [styles.cta, pressed && styles.pressed, started && styles.ctaDone]}
      >
        <Text style={styles.ctaText}>{started ? 'Wyzwanie aktywne ✓' : 'Zaczynam'}</Text>
      </Pressable>

      <Text style={styles.secondaryTitle}>Spróbuj też</Text>
      <View style={styles.secondaryRow}>
        <Pressable onPress={easier} hitSlop={12}>
          <Text style={styles.secondaryAction}>Prostsza wersja  →</Text>
        </Pressable>
        <Pressable onPress={() => setVariant(2)} hitSlop={12}>
          <Text style={styles.secondaryAction}>Na uczelni  →</Text>
        </Pressable>
      </View>
      <View style={styles.divider} />
      <Text style={styles.micro}>Mały krok &gt; perfekcyjny opener.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 34 },
  header: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start' },
  brand: { color: colors.ink, fontFamily: fonts.bold, fontSize: 29, lineHeight: 38, letterSpacing: -0.8 },
  brandDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.teal, marginLeft: 5, marginTop: 9 },
  stats: { flexDirection: 'row', gap: 2 },
  tabs: { marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 30 },
  tab: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 14 },
  tabActive: { color: colors.teal },
  tabLine: { width: 28, height: 3, borderRadius: 2, backgroundColor: colors.teal, marginTop: 10 },
  kicker: { marginTop: 34, color: colors.muted, fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.7 },
  title: { marginTop: 12, color: colors.ink, fontFamily: fonts.bold, fontSize: 35, lineHeight: 40, letterSpacing: -1.15 },
  description: { marginTop: 16, color: colors.ink, fontFamily: fonts.regular, fontSize: 20, lineHeight: 29 },
  accent: { color: colors.teal, fontFamily: fonts.bold },
  opener: { marginTop: 26, minHeight: 118, flexDirection: 'row', borderRadius: 24, backgroundColor: colors.tealSoft, padding: 20 },
  quote: { color: colors.teal, fontFamily: fonts.bold, fontSize: 36, marginRight: 12, marginTop: -3 },
  openerText: { flex: 1, color: colors.ink, fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 },
  support: { marginTop: 20, color: colors.muted, fontFamily: fonts.regular, fontSize: 15 },
  cta: { marginTop: 24, height: 54, borderRadius: 18, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  ctaDone: { backgroundColor: '#088E86' },
  ctaText: { color: colors.white, fontFamily: fonts.bold, fontSize: 18 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  secondaryTitle: { marginTop: 34, color: colors.ink, fontFamily: fonts.bold, fontSize: 17 },
  secondaryRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
  secondaryAction: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16 },
  divider: { marginTop: 18, height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  micro: { marginTop: 14, color: colors.muted, fontFamily: fonts.regular, fontSize: 13 },
});
