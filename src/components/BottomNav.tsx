import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

export type TabKey = 'today' | 'reels' | 'coach' | 'progress';

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  dark?: boolean;
};

const tabs: Array<{ key: TabKey; label: string; glyph: string }> = [
  { key: 'today', label: 'Dziś', glyph: '●' },
  { key: 'reels', label: 'Rolki', glyph: '▶' },
  { key: 'coach', label: 'Coach', glyph: '...' },
  { key: 'progress', label: 'Postęp', glyph: '▥' },
];

export function BottomNav({ active, onChange, dark = false }: Props) {
  return (
    <View style={[styles.wrap, dark && styles.wrapDark]}>
      {tabs.map((tab) => {
        const selected = tab.key === active;
        const color = selected ? colors.teal : dark ? '#A6ADB0' : colors.muted;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.glyph, { color }]}>{tab.glyph}</Text>
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
            <View style={[styles.indicator, selected && styles.indicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: spacing.navHeight,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  wrapDark: { backgroundColor: 'rgba(8,9,9,0.88)', borderTopColor: 'rgba(255,255,255,0.04)' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 7 },
  pressed: { opacity: 0.6 },
  glyph: { fontSize: 17, fontWeight: '700', lineHeight: 20 },
  label: { marginTop: 2, fontSize: 11, fontWeight: '600' },
  indicator: { width: 20, height: 3, borderRadius: 2, marginTop: 5, backgroundColor: 'transparent' },
  indicatorActive: { backgroundColor: colors.teal },
});
