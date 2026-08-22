import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const openerMotion = useRef(new Animated.Value(1)).current;

  const changeVariant = (next: number) => {
    void Haptics.selectionAsync().catch(() => {});
    Animated.timing(openerMotion, {
      toValue: 0,
      duration: 110,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setVariant(next);
      openerMotion.setValue(0);
      Animated.timing(openerMotion, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  };

  const easier = () => changeVariant((variant + 1) % variants.length);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.header}>
        <View style={styles.brandRow} accessibilityRole="header">
          <Text style={styles.brand}>Zagadaj</Text>
          <View style={styles.brandDot} />
        </View>
        <View style={styles.stats} accessibilityLabel={`${streak} dni serii, ${xp} punktów`}>
          <Stat value={`${streak} dni`} label="seria" />
          <Stat value={`${xp}`} label="punkty" />
        </View>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        <View>
          <Text style={[styles.tab, styles.tabActive]} accessibilityRole="tab" accessibilityState={{ selected: true }}>Dziś</Text>
          <View style={styles.tabLine} />
        </View>
        <Text style={styles.tab} accessibilityRole="tab">Na uczelni</Text>
        <Text style={styles.tab} accessibilityRole="tab">W mieście</Text>
      </View>

      <Text style={styles.kicker}>DZIŚ</Text>
      <Text style={styles.title} accessibilityRole="header">Dzisiejsze{`\n`}wyzwanie</Text>
      <Text style={styles.description}>
        Zagadaj dziś do 1 osoby,{`\n`}z którą złapiesz{' '}
        <Text style={styles.accent}>naturalny vibe.</Text>
      </Text>

      <Animated.View
        accessible
        accessibilityLabel={`Proponowany starter: ${variants[variant]}`}
        style={[
          styles.opener,
          {
            opacity: openerMotion,
            transform: [
              {
                translateY: openerMotion.interpolate({
                  inputRange: [0, 1],
                  outputRange: [7, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.quote}>“</Text>
        <Text style={styles.openerText}>{variants[variant]}</Text>
      </Animated.View>

      <Text style={styles.support}>Nie chodzi o ideał. Wystarczy zacząć.</Text>

      <Pressable
        onPress={onStart}
        style={({ pressed }) => [styles.cta, pressed && styles.pressed, started && styles.ctaDone]}
        accessibilityRole="button"
        accessibilityLabel={started ? 'Wyzwanie aktywne' : 'Rozpocznij dzisiejsze wyzwanie'}
        accessibilityState={{ selected: started }}
      >
        <Text style={styles.ctaText}>{started ? 'Wyzwanie aktywne ✓' : 'Zaczynam'}</Text>
      </Pressable>

      <Text style={styles.secondaryTitle}>Spróbuj też</Text>
      <View style={styles.secondaryRow}>
        <Pressable
          onPress={easier}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Pokaż prostszy starter"
        >
          <Text style={styles.secondaryAction}>Prostsza wersja  →</Text>
        </Pressable>
        <Pressable
          onPress={() => changeVariant(2)}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Pokaż starter na uczelnię"
        >
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
  content: { paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 36 },
  header: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start' },
  brand: { color: colors.ink, fontFamily: fonts.bold, fontSize: 29, lineHeight: 38, letterSpacing: -0.8 },
  brandDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal, marginLeft: 5, marginTop: 9 },
  stats: { flexDirection: 'row', gap: 2 },
  tabs: { marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 30 },
  tab: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 14 },
  tabActive: { color: colors.teal },
  tabLine: { width: 28, height: 2, borderRadius: 1, backgroundColor: colors.teal, marginTop: 10 },
  kicker: { marginTop: 36, color: colors.muted, fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.7 },
  title: { marginTop: 12, color: colors.ink, fontFamily: fonts.bold, fontSize: 36, lineHeight: 40, letterSpacing: -1.1 },
  description: { marginTop: 17, color: colors.ink, fontFamily: fonts.regular, fontSize: 20, lineHeight: 29 },
  accent: { color: colors.teal, fontFamily: fonts.bold },
  opener: { marginTop: 34, minHeight: 96, flexDirection: 'row', alignItems: 'flex-start', paddingRight: 12 },
  quote: { color: colors.teal, fontFamily: fonts.bold, fontSize: 42, lineHeight: 46, marginRight: 14, marginTop: -5 },
  openerText: { flex: 1, color: colors.ink, fontFamily: fonts.semibold, fontSize: 21, lineHeight: 29, letterSpacing: -0.15 },
  support: { marginTop: 10, color: colors.muted, fontFamily: fonts.regular, fontSize: 15 },
  cta: { marginTop: 26, height: 54, borderRadius: 14, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  ctaDone: { backgroundColor: '#088E86' },
  ctaText: { color: colors.white, fontFamily: fonts.bold, fontSize: 18 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  secondaryTitle: { marginTop: 36, color: colors.ink, fontFamily: fonts.bold, fontSize: 17 },
  secondaryRow: { marginTop: 19, flexDirection: 'row', justifyContent: 'space-between' },
  secondaryAction: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16 },
  divider: { marginTop: 22, height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  micro: { marginTop: 14, color: colors.muted, fontFamily: fonts.regular, fontSize: 13 },
});
