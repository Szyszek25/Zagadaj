import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View, type ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardVideo } from '../components/CardVideo';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type ReelCategory = 'campus' | 'cafe' | 'city';
type ReelFilter = 'live' | 'campus' | 'cafe';

type Reel = {
  id: string;
  category: ReelCategory;
  place: string;
  title: string;
  line: string;
  author: string;
  distance: string;
  likes: string;
  comments: string;
  duration: string;
  video: string;
  poster: string;
};

const reels: Reel[] = [
  {
    id: 'coffee',
    category: 'cafe',
    place: 'WARSZAWA • KAWIARNIA',
    title: 'Jak zagadać\nw kolejce po kawę',
    line: '„Hej, stoisz tu często czy dziś wyjątkowo?”',
    author: '@ania.zagaduje',
    distance: '600 m',
    likes: '1,2K',
    comments: '86',
    duration: '0:23',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop',
  },
  {
    id: 'campus',
    category: 'campus',
    place: 'KAMPUS • UCZELNIA',
    title: 'Od „cześć”\ndo rozmowy',
    line: '„Ej, wiesz może gdzie tu jest najlepsze miejsce, żeby usiąść?”',
    author: '@maks.na.kampusie',
    distance: '1,1 km',
    likes: '892',
    comments: '54',
    duration: '0:18',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop',
  },
  {
    id: 'park',
    category: 'city',
    place: 'MOKOTÓW • PARK',
    title: 'Komplement,\nktóry nie brzmi dziwnie',
    line: '„Masz świetny styl — serio. Miłego dnia!”',
    author: '@ola.zagaduje',
    distance: '1,8 km',
    likes: '2,4K',
    comments: '131',
    duration: '0:19',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop',
  },
  {
    id: 'lecture',
    category: 'campus',
    place: 'SGGW • HOL',
    title: 'Co powiedzieć\nprzed zajęciami',
    line: '„Hej, też pierwszy raz masz z nim zajęcia?”',
    author: '@zosia.start',
    distance: '900 m',
    likes: '641',
    comments: '39',
    duration: '0:16',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop',
  },
];

const filters: Array<{ key: ReelFilter; label: string }> = [
  { key: 'live', label: 'Na żywo' },
  { key: 'campus', label: 'Na uczelni' },
  { key: 'cafe', label: 'Kawiarnia' },
];

export function ReelsScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabChrome = spacing.navHeight + Math.max(insets.bottom, 4);
  const reelHeight = Math.max(520, height - tabChrome);
  const [filter, setFilter] = useState<ReelFilter>('live');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const visibleReels = useMemo(() => reels.filter((item) => filter === 'live' || item.category === filter), [filter]);
  const [activeId, setActiveId] = useState(visibleReels[0]?.id ?? reels[0].id);
  const listRef = useRef<FlatList<Reel>>(null);

  const visibility = useRef(({ viewableItems }: { viewableItems: ViewToken<Reel>[] }) => {
    const next = viewableItems[0]?.item?.id;
    if (next) setActiveId(next);
  }).current;

  const changeFilter = (next: ReelFilter) => {
    setFilter(next);
    const nextData = reels.filter((item) => next === 'live' || item.category === next);
    setActiveId(nextData[0]?.id ?? reels[0].id);
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: false }));
    void Haptics.selectionAsync().catch(() => {});
  };

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
        ref={listRef}
        data={visibleReels}
        extraData={{ filter, liked, saved, activeId }}
        keyExtractor={(item) => item.id}
        pagingEnabled
        decelerationRate="fast"
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={visibility}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        renderItem={({ item }) => (
          <View style={[styles.reel, { height: reelHeight }]}>
            <CardVideo
              source={item.video}
              posterUri={item.poster}
              isVisible={activeId === item.id}
              muted
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.sceneShade} />

            <View style={[styles.topOverlay, { top: insets.top + 14 }]}>
              <Text style={styles.title}>Rolki</Text>
              <Text style={styles.sub}>prawdziwe przykłady pierwszych zdań</Text>
              <View style={styles.filters} accessibilityRole="tablist">
                {filters.map((itemFilter) => {
                  const active = filter === itemFilter.key;
                  return (
                    <Pressable
                      key={itemFilter.key}
                      onPress={() => changeFilter(itemFilter.key)}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: active }}
                      hitSlop={8}
                    >
                      <Text style={active ? styles.filterActive : styles.filter}>{itemFilter.label}</Text>
                      <View style={[styles.filterLine, active && styles.filterLineActive]} />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={[styles.bottomCopy, { bottom: 82 + insets.bottom }]}>
              <Text style={styles.place}>{item.place}</Text>
              <View style={styles.titleRow}>
                <Text style={styles.reelTitle}>{item.title}</Text>
                <Text style={styles.duration}>{item.duration}</Text>
              </View>
              <Text style={styles.line}>{item.line}</Text>
              <Text style={styles.author}>{item.author}  •  {item.distance}</Text>
              <Text style={styles.swipe}>Przesuń w górę po następny</Text>
            </View>

            <View style={[styles.actions, { bottom: 150 + insets.bottom }]}>
              <Pressable
                onPress={() => toggleLike(item.id)}
                style={({ pressed }) => [styles.action, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={liked[item.id] ? 'Usuń polubienie' : 'Polub rolkę'}
              >
                <Ionicons name={liked[item.id] ? 'heart' : 'heart-outline'} color={liked[item.id] ? colors.teal : colors.white} size={29} />
                <Text style={styles.actionCount}>{item.likes}</Text>
              </Pressable>
              <Pressable
                onPress={() => void Haptics.selectionAsync().catch(() => {})}
                style={({ pressed }) => [styles.action, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Komentarze"
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
              >
                <Ionicons name={saved[item.id] ? 'bookmark' : 'bookmark-outline'} color={colors.white} size={27} />
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
  sceneShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.30)' },
  topOverlay: { position: 'absolute', left: 20, right: 20 },
  title: { color: colors.white, fontFamily: fonts.bold, fontSize: 28, letterSpacing: -0.7 },
  sub: { color: '#CCD1D1', fontFamily: fonts.regular, fontSize: 12, marginTop: -2 },
  filters: { marginTop: 18, flexDirection: 'row', gap: 28 },
  filterActive: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  filter: { color: '#B8BDBF', fontFamily: fonts.semibold, fontSize: 13 },
  filterLine: { marginTop: 9, width: '100%', height: 2, borderRadius: 1, backgroundColor: 'transparent' },
  filterLineActive: { backgroundColor: colors.teal },
  bottomCopy: { position: 'absolute', left: 20, right: 62 },
  place: { color: '#D4DBDB', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.5 },
  titleRow: { marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  reelTitle: { flex: 1, color: colors.white, fontFamily: fonts.bold, fontSize: 28, lineHeight: 31, letterSpacing: -0.7 },
  duration: { color: colors.white, fontFamily: fonts.medium, fontSize: 13, marginLeft: 8, marginBottom: 2 },
  line: { color: colors.white, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, marginTop: 12 },
  author: { color: '#CCD1D1', fontFamily: fonts.semibold, fontSize: 12, marginTop: 20 },
  swipe: { color: '#A8B0B0', fontFamily: fonts.regular, fontSize: 11, marginTop: 24 },
  actions: { position: 'absolute', right: 12, alignItems: 'center', gap: 22 },
  action: { alignItems: 'center', minWidth: 44 },
  actionCount: { color: colors.white, fontFamily: fonts.semibold, fontSize: 10, marginTop: 4 },
  pressed: { opacity: 0.64, transform: [{ scale: 0.94 }] },
});
