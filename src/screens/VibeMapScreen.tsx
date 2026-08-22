import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChallengeScope } from '../domain/challenges';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type WindowKey = 'now' | 'evening' | 'weekend';

type Spot = {
  id: string;
  name: string;
  area: string;
  vibe: string;
  score: number;
  crowd: 'spokojnie' | 'średnio' | 'dużo ludzi';
  best: string;
  scope: ChallengeScope;
  x: number;
  y: number;
  windows: WindowKey[];
};

const spots: Spot[] = [
  { id: 'bulwary', name: 'Bulwary Wiślane', area: 'Śródmieście', vibe: 'luźny / social', score: 94, crowd: 'dużo ludzi', best: '18:30–22:30', scope: 'city', x: 73, y: 26, windows: ['now', 'evening', 'weekend'] },
  { id: 'pole', name: 'Pole Mokotowskie', area: 'Mokotów', vibe: 'spacer / sport', score: 88, crowd: 'dużo ludzi', best: '17:00–21:00', scope: 'city', x: 44, y: 48, windows: ['now', 'evening', 'weekend'] },
  { id: 'sggw', name: 'Kampus SGGW', area: 'Ursynów', vibe: 'student / casual', score: 82, crowd: 'średnio', best: '11:30–16:30', scope: 'campus', x: 38, y: 76, windows: ['now'] },
  { id: 'kawiarnia', name: 'Kawiarnie przy Placu Zbawiciela', area: 'Śródmieście', vibe: 'coffee / rozmowa', score: 85, crowd: 'średnio', best: '15:00–20:00', scope: 'city', x: 58, y: 39, windows: ['now', 'evening', 'weekend'] },
  { id: 'pawilony', name: 'Pawilony', area: 'Nowy Świat', vibe: 'wieczór / spontanicznie', score: 91, crowd: 'dużo ludzi', best: '20:00–00:30', scope: 'city', x: 68, y: 33, windows: ['evening', 'weekend'] },
  { id: 'skaryszewski', name: 'Park Skaryszewski', area: 'Praga', vibe: 'spokojny / naturalny', score: 77, crowd: 'spokojnie', best: '14:00–19:00', scope: 'city', x: 84, y: 49, windows: ['now', 'weekend'] },
];

const filters: Array<{ key: WindowKey; label: string }> = [
  { key: 'now', label: 'Teraz' },
  { key: 'evening', label: 'Wieczorem' },
  { key: 'weekend', label: 'Weekend' },
];

function crowdColor(crowd: Spot['crowd']) {
  if (crowd === 'dużo ludzi') return colors.rust;
  if (crowd === 'średnio') return colors.garden;
  return colors.muted;
}

export function VibeMapScreen() {
  const router = useRouter();
  const [windowKey, setWindowKey] = useState<WindowKey>('now');
  const visible = useMemo(() => spots.filter((spot) => spot.windows.includes(windowKey)), [windowKey]);
  const [selectedId, setSelectedId] = useState(visible[0]?.id ?? spots[0].id);
  const selected = visible.find((spot) => spot.id === selectedId) ?? visible[0] ?? spots[0];

  const chooseWindow = (key: WindowKey) => {
    setWindowKey(key);
    const next = spots.find((spot) => spot.windows.includes(key));
    if (next) setSelectedId(next.id);
    void Haptics.selectionAsync().catch(() => {});
  };

  const selectSpot = (spot: Spot) => {
    setSelectedId(spot.id);
    void Haptics.selectionAsync().catch(() => {});
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <Text style={styles.kicker}>VIBE MAP</Text>
      <Text style={styles.hero}>Gdzie dziś{`\n`}łatwiej zagadać?</Text>
      <Text style={styles.subtitle}>Nie pokazujemy konkretnych osób. Tylko zbiorczy sygnał aktywności i charakter miejsca.</Text>

      <View style={styles.filters} accessibilityRole="tablist">
        {filters.map((filter) => {
          const active = filter.key === windowKey;
          return (
            <Pressable
              key={filter.key}
              onPress={() => chooseWindow(filter.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={[styles.filter, active && styles.filterActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.map}>
        <View style={[styles.road, styles.roadA]} />
        <View style={[styles.road, styles.roadB]} />
        <View style={[styles.road, styles.roadC]} />
        <View style={styles.river} />
        <Text style={styles.mapLabelA}>CENTRUM</Text>
        <Text style={styles.mapLabelB}>MOKOTÓW</Text>
        <Text style={styles.mapLabelC}>URSYNÓW</Text>
        {visible.map((spot) => {
          const active = spot.id === selected.id;
          return (
            <Pressable
              key={spot.id}
              onPress={() => selectSpot(spot)}
              accessibilityRole="button"
              accessibilityLabel={`${spot.name}, vibe ${spot.score} na 100`}
              style={[
                styles.pin,
                { left: `${spot.x}%`, top: `${spot.y}%` },
                active && styles.pinActive,
              ]}
            >
              <View style={[styles.pinCore, { backgroundColor: crowdColor(spot.crowd) }]}>
                <Text style={styles.pinScore}>{spot.score}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.detail}>
        <View style={styles.detailTop}>
          <View style={styles.detailCopy}>
            <Text style={styles.detailArea}>{selected.area.toUpperCase()}</Text>
            <Text style={styles.detailName}>{selected.name}</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>{selected.score}</Text>
            <Text style={styles.scoreLabel}>VIBE</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={17} color={crowdColor(selected.crowd)} />
            <Text style={styles.metaText}>{selected.crowd}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={17} color={colors.navy} />
            <Text style={styles.metaText}>{selected.best}</Text>
          </View>
        </View>
        <Text style={styles.vibeText}>{selected.vibe}</Text>
        <Pressable
          onPress={() => router.push({ pathname: '/practice-session', params: { scope: selected.scope } })}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Daj mi wyzwanie na ten spot</Text>
          <Ionicons name="arrow-forward" size={19} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.privacyNote}>
        <Ionicons name="shield-checkmark-outline" size={17} color={colors.garden} />
        <Text style={styles.privacyText}>Docelowo wynik powinien bazować na anonimowych check-inach i zagregowanej aktywności, nigdy na śledzeniu pojedynczych osób.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.page, paddingTop: 8, paddingBottom: spacing.navHeight + 44 },
  kicker: { color: colors.rust, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.5 },
  hero: { color: colors.navy, fontFamily: fonts.bold, fontSize: 40, lineHeight: 42, letterSpacing: -1.4, marginTop: 8 },
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, marginTop: 12, maxWidth: 340 },
  filters: { flexDirection: 'row', gap: 8, marginTop: 22 },
  filter: { minHeight: 40, paddingHorizontal: 15, borderRadius: 20, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  filterActive: { backgroundColor: colors.navy },
  filterText: { color: colors.navy, fontFamily: fonts.semibold, fontSize: 13 },
  filterTextActive: { color: colors.white },
  map: { marginTop: 18, height: 370, borderRadius: 30, overflow: 'hidden', backgroundColor: '#EAE4D8', position: 'relative' },
  road: { position: 'absolute', height: 10, borderRadius: 6, backgroundColor: '#F8F4EC', opacity: 0.95 },
  roadA: { width: 440, left: -48, top: 168, transform: [{ rotate: '18deg' }] },
  roadB: { width: 420, left: -32, top: 245, transform: [{ rotate: '-25deg' }] },
  roadC: { width: 360, left: 68, top: 88, transform: [{ rotate: '66deg' }] },
  river: { position: 'absolute', right: -24, top: -20, width: 80, height: 430, backgroundColor: '#C9D9DB', transform: [{ rotate: '5deg' }], borderRadius: 46 },
  mapLabelA: { position: 'absolute', left: 154, top: 104, color: 'rgba(7,31,54,0.35)', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.4 },
  mapLabelB: { position: 'absolute', left: 82, top: 222, color: 'rgba(7,31,54,0.35)', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.4 },
  mapLabelC: { position: 'absolute', left: 70, top: 310, color: 'rgba(7,31,54,0.35)', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.4 },
  pin: { position: 'absolute', width: 48, height: 48, marginLeft: -24, marginTop: -24, borderRadius: 24, backgroundColor: 'rgba(255,252,246,0.78)', alignItems: 'center', justifyContent: 'center' },
  pinActive: { transform: [{ scale: 1.16 }], backgroundColor: colors.white },
  pinCore: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  pinScore: { color: colors.white, fontFamily: fonts.bold, fontSize: 12 },
  detail: { marginTop: 18, paddingVertical: 18 },
  detailTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  detailCopy: { flex: 1, paddingRight: 14 },
  detailArea: { color: colors.rust, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.2 },
  detailName: { color: colors.navy, fontFamily: fonts.bold, fontSize: 24, lineHeight: 28, marginTop: 5 },
  scoreBadge: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  scoreValue: { color: colors.navy, fontFamily: fonts.bold, fontSize: 20 },
  scoreLabel: { color: colors.muted, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 0.8 },
  metaRow: { flexDirection: 'row', gap: 18, marginTop: 18 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: colors.muted, fontFamily: fonts.medium, fontSize: 12 },
  vibeText: { color: colors.navy, fontFamily: fonts.semibold, fontSize: 14, marginTop: 12 },
  cta: { marginTop: 20, height: 54, borderRadius: 14, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { color: colors.white, fontFamily: fonts.bold, fontSize: 15 },
  privacyNote: { marginTop: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: colors.gardenSoft, borderRadius: 18, padding: 15 },
  privacyText: { flex: 1, color: colors.muted, fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 17 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
});
