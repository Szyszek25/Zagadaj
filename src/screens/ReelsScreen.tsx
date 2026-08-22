import React, { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

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
  const [activeId, setActiveId] = useState(reels[0].id);

  const visibility = useRef(({ viewableItems }: { viewableItems: ViewToken<Reel>[] }) => {
    const next = viewableItems[0]?.item?.id;
    if (next) setActiveId(next);
  }).current;

  return (
    <View style={styles.screen}>
      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={visibility}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        renderItem={({ item }) => (
          <View style={[styles.reel, { height: reelHeight }]}>
            <View style={styles.scene}>
              <View style={[styles.person, styles.personLeft, { backgroundColor: item.left }]} />
              <View style={[styles.person, styles.personRight, { backgroundColor: item.right }]} />
              <View style={[styles.counter, { backgroundColor: item.counter }]} />
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

            <Pressable style={({ pressed }) => [styles.play, pressed && styles.pressed]}>
              <Text style={styles.playGlyph}>▶</Text>
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
                onPress={() => setLiked((old) => ({ ...old, [item.id]: !old[item.id] }))}
                style={({ pressed }) => [styles.action, pressed && styles.pressed]}
              >
                <Text style={[styles.actionGlyph, liked[item.id] && { color: colors.teal }]}>♥</Text>
                <Text style={styles.actionCount}>{item.likes}</Text>
              </Pressable>
              <View style={styles.action}>
                <Text style={styles.actionGlyph}>•••</Text>
                <Text style={styles.actionCount}>{item.comments}</Text>
              </View>
              <View style={styles.action}>
                <Text style={styles.actionGlyph}>▱</Text>
              </View>
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
  topOverlay: { position: 'absolute', left: 20, right: 20 },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', letterSpacing: -0.7 },
  sub: { color: '#CCD1D1', fontSize: 12, marginTop: -2 },
  filters: { marginTop: 18, flexDirection: 'row', gap: 30 },
  filterActive: { color: colors.white, fontSize: 13, fontWeight: '700' },
  filter: { color: '#B8BDBF', fontSize: 13, fontWeight: '600' },
  filterLine: { marginTop: 10, width: 34, height: 3, borderRadius: 2, backgroundColor: colors.teal },
  play: { position: 'absolute', alignSelf: 'center', top: '41%', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(8,9,9,0.5)', alignItems: 'center', justifyContent: 'center' },
  playGlyph: { color: colors.white, fontSize: 24, marginLeft: 4 },
  bottomCopy: { position: 'absolute', left: 20, right: 62 },
  place: { color: '#D4DBDB', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  titleRow: { marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  reelTitle: { flex: 1, color: colors.white, fontSize: 28, lineHeight: 31, fontWeight: '800', letterSpacing: -0.7 },
  duration: { color: colors.white, fontSize: 13, marginLeft: 8, marginBottom: 2 },
  line: { color: colors.white, fontSize: 15, lineHeight: 21, marginTop: 12 },
  author: { color: '#CCD1D1', fontSize: 12, fontWeight: '600', marginTop: 20 },
  swipe: { color: '#A8B0B0', fontSize: 11, marginTop: 24 },
  actions: { position: 'absolute', right: 12, alignItems: 'center', gap: 20 },
  action: { alignItems: 'center', minWidth: 42 },
  actionGlyph: { color: colors.white, fontSize: 24, fontWeight: '800' },
  actionCount: { color: colors.white, fontSize: 10, fontWeight: '600', marginTop: 3 },
  pressed: { opacity: 0.65, transform: [{ scale: 0.96 }] },
});
