import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, type ZagadajProfile } from '../contexts/AuthContext';
import { MAX_INTERESTS, MIN_INTERESTS, isProfileComplete, toggleInterestSelection } from '../domain/onboarding';
import { colors } from '../theme';
import { fonts } from '../typography';

type Draft = Partial<ZagadajProfile>;

type Step =
  | { key: 'name'; title: string; type: 'text' }
  | { key: 'context'; title: string; type: 'single'; options: Array<[ZagadajProfile['context'], string]> }
  | { key: 'city'; title: string; type: 'city' }
  | { key: 'goal'; title: string; type: 'single'; options: Array<[ZagadajProfile['goal'], string]> }
  | { key: 'confidence'; title: string; type: 'single'; options: Array<[ZagadajProfile['confidence'], string]> }
  | { key: 'interests'; title: string; type: 'multi'; options: string[] };

const steps: Step[] = [
  { key: 'name', title: 'Jak masz na imię? 👋', type: 'text' },
  {
    key: 'context',
    title: 'Gdzie najczęściej poznajesz ludzi?',
    type: 'single',
    options: [
      ['student', '🎓 Uczelnia / szkoła'],
      ['work', '💼 Praca / networking'],
      ['other', '🌆 Miasto i codzienność'],
    ],
  },
  { key: 'city', title: 'W jakim mieście chcesz ćwiczyć?', type: 'city' },
  {
    key: 'goal',
    title: 'Po co chcesz częściej zagadywać?',
    type: 'single',
    options: [
      ['confidence', '⚡ Więcej pewności siebie'],
      ['friends', '🤝 Nowe znajomości'],
      ['dating', '💘 Randkowanie'],
      ['networking', '🧠 Networking'],
    ],
  },
  {
    key: 'confidence',
    title: 'Jak dziś czujesz się z pierwszym krokiem?',
    type: 'single',
    options: [
      ['low', '😶 Raczej trudno'],
      ['medium', '🙂 Zależy od sytuacji'],
      ['high', '🔥 Mogę działać'],
    ],
  },
  {
    key: 'interests',
    title: 'Co ma Ci podpowiadać lepsze tematy?',
    type: 'multi',
    options: ['Kawa', 'Sport', 'Muzyka', 'Technologia', 'Podróże', 'Filmy', 'Nauka', 'Psychologia', 'Sztuka', 'Jedzenie'],
  },
];

const popularCities = ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'];

export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuth();
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({ interests: [] });
  const [cityText, setCityText] = useState('');
  const [busy, setBusy] = useState(false);
  const motion = useRef(new Animated.Value(1)).current;
  const step = steps[index] ?? steps[0];

  const effectiveDraft = useMemo<Draft>(() => {
    if (step.key === 'city' && cityText.trim()) return { ...draft, city: cityText.trim() };
    return draft;
  }, [cityText, draft, step.key]);

  const canContinue = useMemo(() => {
    if (step.key === 'name') return Boolean(draft.name?.trim());
    if (step.key === 'city') return Boolean((draft.city || cityText).trim());
    if (step.key === 'interests') return (draft.interests?.length ?? 0) >= MIN_INTERESTS;
    return Boolean(draft[step.key]);
  }, [cityText, draft, step.key]);

  const animateTo = (next: number) => {
    Animated.timing(motion, { toValue: 0, duration: 110, useNativeDriver: true }).start(() => {
      setIndex(Math.max(0, Math.min(steps.length - 1, next)));
      motion.setValue(0);
      Animated.spring(motion, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 190, mass: 0.65 }).start();
    });
  };

  const select = <K extends keyof ZagadajProfile>(key: K, value: ZagadajProfile[K]) => {
    setDraft((old) => ({ ...old, [key]: value }));
    void Haptics.selectionAsync().catch(() => {});
  };

  const toggleInterest = (interest: string) => {
    setDraft((old) => ({ ...old, interests: toggleInterestSelection(old.interests ?? [], interest) }));
    void Haptics.selectionAsync().catch(() => {});
  };

  const continueFlow = async () => {
    if (!canContinue || busy) return;

    const nextDraft: Draft = step.key === 'city' && cityText.trim()
      ? { ...draft, city: cityText.trim() }
      : effectiveDraft;

    if (step.key === 'city' && cityText.trim()) setDraft(nextDraft);

    if (index < steps.length - 1) {
      animateTo(index + 1);
      return;
    }

    if (!isProfileComplete(nextDraft)) return;

    setBusy(true);
    try {
      await completeOnboarding(nextDraft);
      router.replace('/(tabs)');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10, paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (index > 0 ? animateTo(index - 1) : router.back())}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Wstecz"
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={23} color={colors.ink} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((index + 1) / steps.length) * 100}%` }]} />
        </View>
        <Text style={styles.counter}>{index + 1}/{steps.length}</Text>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: motion,
            transform: [{ translateX: motion.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
          },
        ]}
      >
        <Text style={styles.label}>USTAWMY ZAGADAJ POD CIEBIE</Text>
        <Text style={styles.title}>{step.title}</Text>

        {step.type === 'text' ? (
          <View style={styles.textBlock}>
            <TextInput
              value={draft.name ?? ''}
              onChangeText={(value) => setDraft((old) => ({ ...old, name: value }))}
              placeholder="Twoje imię"
              placeholderTextColor={colors.muted}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => void continueFlow()}
              style={styles.bigInput}
            />
          </View>
        ) : null}

        {step.type === 'city' ? (
          <View style={styles.options}>
            <View style={styles.cityInputWrap}>
              <Ionicons name="location-outline" size={20} color={colors.muted} />
              <TextInput
                value={cityText}
                onChangeText={(value) => {
                  setCityText(value);
                  if (value) setDraft((old) => ({ ...old, city: value }));
                }}
                placeholder="Wpisz miasto"
                placeholderTextColor={colors.muted}
                style={styles.cityInput}
              />
            </View>
            <View style={styles.chips}>
              {popularCities.map((city) => {
                const active = draft.city === city && !cityText;
                return (
                  <Pressable
                    key={city}
                    onPress={() => {
                      setCityText('');
                      select('city', city);
                    }}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{city}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step.type === 'single' ? (
          <View style={styles.options}>
            {step.options.map(([value, label]) => {
              const active = draft[step.key] === value;
              return (
                <Pressable
                  key={String(value)}
                  onPress={() => {
                    if (step.key === 'context') select('context', value as ZagadajProfile['context']);
                    if (step.key === 'goal') select('goal', value as ZagadajProfile['goal']);
                    if (step.key === 'confidence') select('confidence', value as ZagadajProfile['confidence']);
                  }}
                  style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && styles.pressed]}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
                  <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={active ? colors.teal : colors.line} />
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {step.type === 'multi' ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.multiContent}>
            <Text style={styles.hint}>Wybierz {MIN_INTERESTS}–{MAX_INTERESTS}. Dzięki temu pytania będą mniej losowe.</Text>
            <View style={styles.chips}>
              {step.options.map((item) => {
                const active = draft.interests?.includes(item) ?? false;
                const blocked = !active && (draft.interests?.length ?? 0) >= MAX_INTERESTS;
                return (
                  <Pressable
                    key={item}
                    onPress={() => toggleInterest(item)}
                    disabled={blocked}
                    style={[styles.chip, styles.interestChip, active && styles.chipActive, blocked && styles.blocked]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        ) : null}
      </Animated.View>

      <Pressable
        onPress={() => void continueFlow()}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canContinue || busy }}
        style={({ pressed }) => [styles.cta, (!canContinue || busy) && styles.ctaDisabled, pressed && canContinue && styles.pressed]}
      >
        <Text style={styles.ctaText}>{index === steps.length - 1 ? 'Zaczynam' : 'Dalej'}</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  header: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 13 },
  back: { width: 34, height: 34, alignItems: 'flex-start', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.teal, borderRadius: 2 },
  counter: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 12, width: 30, textAlign: 'right' },
  content: { flex: 1, paddingTop: 46 },
  label: { color: colors.teal, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.8 },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 34, lineHeight: 39, letterSpacing: -1, marginTop: 11, maxWidth: 345 },
  textBlock: { marginTop: 42 },
  bigInput: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 28, paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: colors.teal },
  options: { marginTop: 34, gap: 10 },
  option: { minHeight: 58, borderRadius: 14, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 17, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  optionActive: { backgroundColor: colors.tealSoft, borderColor: colors.teal },
  optionText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16 },
  optionTextActive: { color: colors.ink },
  cityInputWrap: { height: 56, borderRadius: 14, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  cityInput: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 16, paddingVertical: 0 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: { minHeight: 40, borderRadius: 20, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.soft },
  interestChip: { paddingHorizontal: 17, minHeight: 44 },
  chipActive: { backgroundColor: colors.teal },
  chipText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 14 },
  chipTextActive: { color: colors.white },
  blocked: { opacity: 0.38 },
  multiContent: { paddingTop: 22, paddingBottom: 20 },
  hint: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, marginBottom: 14 },
  cta: { height: 56, borderRadius: 14, backgroundColor: colors.teal, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  ctaText: { color: colors.white, fontFamily: fonts.bold, fontSize: 17 },
  ctaDisabled: { opacity: 0.35 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
});
