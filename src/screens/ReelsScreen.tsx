import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Reel = {
  id: string;
  place: string;
  title: string;
  line: string;
  author: string;
  distance: string;
  likes: string;
  comments: string;
  duration: string;
  left: string;
  right: string;
  counter: string;
};

const reels: Reel[] = [
  {
    id: 'coffee',
    place: 'WARSZAWA • KAWIARNIA',
    title: 'Jak zagadać\nw kolejce po kawę',
    line: '„Hej, stoisz tu często czy dziś wyjątkowo?”',
    author: '@ania.zagaduje',
    distance: '600 m',
    likes: '1,2K',
    comments: '86',
    duration: '0:23',
    left: '#294A46',
    right: '#5C5548',
    counter: '#2B211A',
  },
  {
    id: 'campus',
    place: 'SGGW • KAMPUS',
    title: 'Od „cześć”\ndo rozmowy',
    line: '„Ej, wiesz może gdzie tu jest najlepsze miejsce, żeby usiąść?”',
    author: '@maks.na.kampusie',
    distance: '1,1 km',
    likes: '892',
    comments: '54',
    duration: '0:18',
    left: '#304458',
    right: '#66504C',
    counter: '#1C252C',
  },
  {
    id: 'park',
    place: 'MOKOTÓW • PARK',
    title: 'Komplement,\nktóry nie brzmi dziwnie',
    line: '„Masz świetny styl — serio. Miłego dnia!”',
    author: '@ola.zagaduje',
    distance: '1,8 km',
    likes: '2,4K',
    comments: '131',
    duration: '0:19',
    left: '#284735',
    right: '#61423D',
    counter: '#253023',
  },
];

export function ReelsScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabChrome = spacing.navHeight + Math.max(insets.bottom, 4);
  const reelHeight = Math.max(520, height - tabChrome);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState(reels[0].id);

  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 70, minimumViewTime: 120 }),
    [],
  );

  const visibility = useRef(({ viewableItems }: { viewableItems: ViewToken<Reel>[] }) => {
    const next = viewableItems[0]?.item?.id;
    if (next) setActiveId(next);
  }).current;

  const toggleLike = (id: string) => {
    setLiked((old) => ({ ...old, [id]: !old[id] }));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const toggleSaved = (id: string) => {
    setSaved((old) => ({ ...old, [id]: !old[id] }));
    void Haptics.selectionAsync().catch(() => {});
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={visibility}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
        getItemLayout={(_, index) => ({ length: reelHeight, offset: reelHeight * index, index })}
        renderItem={({ item }) => (
          <View
            style={[styles.reel, { height: reelHeight }]}
            accessibilityLabel={`${item.title.replace('\n', ' ')}. ${item.line}`}
          >
            <View style={styles.scene} importantForAccessibility="no-hide-descendants">
              <View style={[styles.person, styles.personLeft, { backgroundColor: item.left }]} />
              <View style={[styles.person, styles.personRight, { backgroundColor: item.right }]} />
              <View style={[styles.counter, { backgroundColor: item.counter }]} />
              <View style={styles.sceneShade} />
            </View>

            <View style={[styles.topOverlay, { top: insets.top + 14 }]}>
              <Text style={styles.title}>Rolki</Text>
              <Text style={styles.sub}>prawdziwe zagadania</Text>
              <View style={styles.filters}>
                <View>
                  <Text style={styles.filterActive}>Na żywo</Text>
                  <View style={styles.filterLine} />
                </View>
                <Text style={styles.filter}>Na uczelni</Text>
                <Text style={styles.filter}>Kawiarnia</Text>
              </View>
            </View>

            <Pressable
              onPress={() => void Haptics.selectionAsync().catch(() => {})}
              style={({ pressed }) => [styles.play, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Odtwórz rolkę: ${item.title.replace('\n', ' ')}`}
            >
              <Ionicons name="play" size={27} color={colors.white} style={styles.playGlyph} />
            </Pressable>

            <View style={[styles.bottomCopy, { bottom: 82 + insets.bottom }]}>
              <Text style={styles.place}>{item.place}</Text>
              <View style={styles.titleRow}>
                <Text style={styles.reelTitle}>{item.title}</Text>
                <Text style={styles.duration}>{item.duration}</Text>
              </View>
              <Text style={styles.line}>{item.line}</Text>
              <Text style={styles.author}>{item.author}  •  {item.distance}</Text>
              <Text style={styles.swipe}>{activeId === item.id ? 'Przesuń w górę po następny' : ''}</Text>
            </View>

            <View style={[styles.actions, { bottom: 150 + insets.bottom }]}>
              <Pressable
                onPress={() => toggleLike(item.id)}
                style={({ pressed }) => [styles.action, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={liked[item.id] ? 'Usuń polubienie' : 'Polub rolkę'}
                accessibilityState={{ selected: Boolean(liked[item.id]) }}
              >
                <Ionicons
                  name={liked[item.id] ? 'heart' : 'heart-outline'}
                  color={liked[item.id] ? colors.teal : colors.white}
                  size={29}
                />
                <Text style={styles.actionCount}>{item.likes}</Text>
              </Pressable>

              <Pressable
                onPress={() => void Haptics.selectionAsync().catch(() => {})}
                style={({ pressed }) => [styles.action, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Komentarze, ${item.comments}`}
              >
                <Ionicons name="chatbubble-outline" color={colors.white} size={27} />
                <Text style={styles.actionCount}>{item.comments}</Text>
              </Pressable>

              <Pressable
                onPress={() => toggleSaved(item.id)}
                style={({ pressed }) => [styles.action, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={saved[item.id] ? 'Usuń z zapisanych' : 'Zapisz rolkę'}
                accessibilityState={{ selected: Boolean(saved[item.id]) }}
              >
                <Ionicons
                  name={saved[item.id] ? 'bookmark' : 'bookmark-outline'}
                  color={colors.white}
                  size={27}
                />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black },
  reel: { width: '100%', backgroundColor: colors.black, overflow: 'hidden' },
  scene: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.dark },
  person: { position: 'absolute', top: '27%', width: '37%', height: '28%', borderRadius: 999, opacity: 0.92 },
  personLeft: { left: '11%' },
  personRight: { right: '9%' },
  counter: { position: 'absolute', left: 0, right: 0, top: '54%', height: '16%', opacity: 0.72 },
  sceneShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.14)' },
  topOverlay: { position: 'absolute', left: 20, right: 20 },
  title: { color: colors.white, fontFamily: fonts.bold, fontSize: 28, letterSpacing: -0.7 },
  sub: { color: '#CCD1D1', fontFamily: fonts.regular, fontSize: 12, marginTop: -2 },
  filters: { marginTop: 18, flexDirection: 'row', gap: 30 },
  filterActive: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  filter: { color: '#B8BDBF', fontFamily: fonts.semibold, fontSize: 13 },
  filterLine: { marginTop: 10, width: 34, height: 2, borderRadius: 1, backgroundColor: colors.teal },
  play: { position: 'absolute', alignSelf: 'center', top: '41%', width: 62, height: 62, borderRadius: 31, backgroundColor: 'rgba(8,9,9,0.46)', alignItems: 'center', justifyContent: 'center' },
  playGlyph: { marginLeft: 3 },
  bottomCopy: { position: 'absolute', left: 20, right: 62 },
  place: { color: '#D4DBDB', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.5 },
  titleRow: { marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  reelTitle: { flex: 1, color: colors.white, fontFamily: fonts.bold, fontSize: 28, lineHeight: 31, letterSpacing: -0.7 },
  duration: { color: colors.white, fontFamily: fonts.medium, fontSize: 13, marginLeft: 8, marginBottom: 2 },
  line: { color: colors.white, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, marginTop: 12 },
  author: { color: '#CCD1D1', fontFamily: fonts.semibold, fontSize: 12, marginTop: 20 },
  swipe: { color: '#A8B0B0', fontFamily: fonts.regular, fontSize: 11, marginTop: 24 },
  actions: { position: 'absolute', right: 12, alignItems: 'center', gap: 22 },
  action: { alignItems: 'center', minWidth: 44, minHeight: 44 },
  actionCount: { color: colors.white, fontFamily: fonts.semibold, fontSize: 10, marginTop: 4 },
  pressed: { opacity: 0.64, transform: [{ scale: 0.94 }] },
});
