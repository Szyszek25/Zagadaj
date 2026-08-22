import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

export function TodayScreen({ xp, streak, started, scope, onScopeChange, onStart }: Props) {
  const [easier, setEasier] = useState(false);
  const openerMotion = useRef(new Animated.Value(1)).current;
  const challenge = getChallenge(scope);

  const animateCopyChange = (change: () => void) => {
    void Haptics.selectionAsync().catch(() => {});
    Animated.timing(openerMotion, {
      toValue: 0,
      duration: 100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      change();
      openerMotion.setValue(0);
      Animated.timing(openerMotion, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  };

  const changeScope = (next: ChallengeScope) => {
    if (next === scope) return;
    animateCopyChange(() => {
      setEasier(false);
      onScopeChange(next);
    });
  };

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

      <View style={styles.tabs} accessibilityRole="tablist">
        {challengeScopes.map((item) => {
          const active = item.key === scope;
          return (
            <Pressable
              key={item.key}
              onPress={() => changeScope(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              hitSlop={8}
              style={styles.tabPress}
            >
              <Text style={[styles.tab, active && styles.tabActive]}>{item.label}</Text>
              <View style={[styles.tabLine, active && styles.tabLineActive]} />
            </Pressable>
          );
        })}
      </View>

      <Animated.View
        style={{
          opacity: openerMotion,
          transform: [{ translateY: openerMotion.interpolate({ inputRange: [0, 1], outputRange: [7, 0] }) }],
        }}
      >
        <Text style={styles.kicker}>{challenge.eyebrow}</Text>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>
          {challenge.description}{' '}
          <Text style={styles.accent}>{challenge.accent}</Text>
        </Text>

        <View style={styles.opener}>
          <Text style={styles.quote}>“</Text>
          <Text style={styles.openerText}>{easier ? challenge.easier : challenge.opener}</Text>
        </View>
      </Animated.View>

      <Text style={styles.support}>Nie chodzi o ideał. Wystarczy zacząć.</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Rozpocznij sesję: ${challenge.eyebrow}`}
        onPress={() => onStart(scope)}
        style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
      >
        <Text style={styles.ctaText}>{started ? 'Ćwicz dalej' : 'Zaczynam'}</Text>
        <Text style={styles.ctaMeta}>5 min  •  +{challenge.xp} XP</Text>
      </Pressable>

      <Text style={styles.secondaryTitle}>Spróbuj też</Text>
      <View style={styles.secondaryRow}>
        <Pressable onPress={() => animateCopyChange(() => setEasier((value) => !value))} hitSlop={12} accessibilityRole="button">
          <Text style={styles.secondaryAction}>{easier ? 'Mocniejsza wersja' : 'Prostsza wersja'}  →</Text>
        </Pressable>
        <Pressable onPress={() => changeScope(scope === 'campus' ? 'city' : 'campus')} hitSlop={12} accessibilityRole="button">
          <Text style={styles.secondaryAction}>{scope === 'campus' ? 'W mieście' : 'Na uczelni'}  →</Text>
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
  tabs: { marginTop: 22, flexDirection: 'row', gap: 26 },
  tabPress: { paddingBottom: 2 },
  tab: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 14 },
  tabActive: { color: colors.teal },
  tabLine: { width: '100%', height: 2, borderRadius: 1, backgroundColor: 'transparent', marginTop: 10 },
  tabLineActive: { backgroundColor: colors.teal },
  kicker: { marginTop: 34, color: colors.muted, fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.7 },
  title: { marginTop: 12, color: colors.ink, fontFamily: fonts.bold, fontSize: 36, lineHeight: 40, letterSpacing: -1.1 },
  description: { marginTop: 17, color: colors.ink, fontFamily: fonts.regular, fontSize: 20, lineHeight: 29 },
  accent: { color: colors.teal, fontFamily: fonts.bold },
  opener: { marginTop: 34, minHeight: 96, flexDirection: 'row', alignItems: 'flex-start', paddingRight: 12 },
  quote: { color: colors.teal, fontFamily: fonts.bold, fontSize: 42, lineHeight: 46, marginRight: 14, marginTop: -5 },
  openerText: { flex: 1, color: colors.ink, fontFamily: fonts.semibold, fontSize: 21, lineHeight: 29, letterSpacing: -0.15 },
  support: { marginTop: 10, color: colors.muted, fontFamily: fonts.regular, fontSize: 15 },
  cta: { marginTop: 26, minHeight: 58, borderRadius: 14, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', paddingVertical: 9 },
  ctaText: { color: colors.white, fontFamily: fonts.bold, fontSize: 18 },
  ctaMeta: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.medium, fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  secondaryTitle: { marginTop: 36, color: colors.ink, fontFamily: fonts.bold, fontSize: 17 },
  secondaryRow: { marginTop: 19, flexDirection: 'row', justifyContent: 'space-between' },
  secondaryAction: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16 },
  divider: { marginTop: 22, height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  micro: { marginTop: 14, color: colors.muted, fontFamily: fonts.regular, fontSize: 13 },
});
