import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Message = { id: number; side: 'user' | 'coach'; text: string; suggestion?: boolean };

const starter: Message[] = [
  { id: 1, side: 'user', text: 'Właśnie zobaczyłem kogoś, do kogo chcę zagadać, ale się stresuję.' },
  { id: 2, side: 'coach', text: 'Nie szukaj idealnego wejścia. Najpierw podejdź bliżej i złap kontekst.' },
  { id: 3, side: 'coach', text: 'Powiedz po prostu: „Hej, będę szczery — chciałem się przywitać.”', suggestion: true },
  { id: 4, side: 'coach', text: 'Jeśli reakcja jest ciepła: „Jak masz na imię?”', suggestion: true },
];

const replies = [
  'Uprość to jeszcze bardziej. Jedno zdanie, pauza i pozwól drugiej osobie odpowiedzieć.',
  'Oprzyj się na sytuacji obok Was. Kontekst zawsze brzmi naturalniej niż wyuczony tekst.',
  'Jeśli czujesz blokadę, policz 3–2–1 i zrób tylko pierwszy krok. Resztę ogarniesz już w ruchu.',
];

export function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>(starter);
  const [input, setInput] = useState('');
  const [scenario, setScenario] = useState('kawiarnia · ktoś stoi sam w kolejce');
  const scrollRef = useRef<ScrollView>(null);
  const shouldAutoScrollRef = useRef(false);

  const nextReply = useMemo(() => replies[messages.length % replies.length], [messages.length]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const base = Date.now();
    shouldAutoScrollRef.current = true;
    setMessages((old) => [
      ...old,
      { id: base, side: 'user', text: trimmed },
      { id: base + 1, side: 'coach', text: nextReply },
    ]);
    setInput('');
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const toggleScenario = () => {
    setScenario((current) =>
      current.includes('kawiarnia') ? 'uczelnia · siedzicie obok siebie przed zajęciami' : 'kawiarnia · ktoś stoi sam w kolejce',
    );
    void Haptics.selectionAsync().catch(() => {});
  };

  const handleContentSizeChange = () => {
    if (!shouldAutoScrollRef.current) return;
    shouldAutoScrollRef.current = false;
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={18}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>COACH</Text>
          <Text style={styles.title}>Coach w Twojej{`\n`}kieszeni.</Text>
        </View>
        <View style={styles.live}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>gotowy</Text>
        </View>
      </View>

      <Pressable onPress={toggleScenario} style={({ pressed }) => [styles.scenario, pressed && styles.pressed]}>
        <View style={styles.scenarioCopy}>
          <Text style={styles.scenarioLabel}>SYTUACJA</Text>
          <Text numberOfLines={1} style={styles.scenarioValue}>{scenario}</Text>
        </View>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageRow, message.side === 'user' ? styles.right : styles.left]}>
            {message.side === 'coach' ? (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>✦</Text>
              </View>
            ) : null}
            <View style={[styles.bubble, message.side === 'user' ? styles.userBubble : styles.coachBubble, message.suggestion && styles.suggestionBubble]}>
              <Text style={[styles.messageText, message.side === 'user' && styles.userMessageText]}>{message.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickRow}>
        {['Uprość', 'Drugie zdanie', 'Jak wyjść?'].map((item, index) => (
          <Pressable
            key={item}
            onPress={() => {
              void Haptics.selectionAsync().catch(() => {});
              if (index === 0) setInput('Daj prostszą wersję');
              if (index === 1) setInput('Co powiedzieć jako drugie zdanie?');
              if (index === 2) setInput('Jak naturalnie zakończyć rozmowę?');
            }}
            style={({ pressed }) => [styles.quick, pressed && styles.pressed]}
          >
            <Text style={styles.quickText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          placeholder="Co się dzieje?"
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="send"
        />
        <Pressable onPress={send} style={({ pressed }) => [styles.send, pressed && styles.pressed]}>
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 8 },
  header: { paddingTop: 8, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  kicker: { color: colors.rust, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.5 },
  title: { color: colors.navy, fontFamily: fonts.bold, fontSize: 38, lineHeight: 40, letterSpacing: -1.2, marginTop: 7 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.garden },
  liveText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 11 },
  scenario: { marginTop: 18, minHeight: 55, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, paddingBottom: 11 },
  scenarioCopy: { flex: 1 },
  scenarioLabel: { color: colors.rust, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.2 },
  scenarioValue: { color: colors.navy, fontFamily: fonts.medium, fontSize: 14, marginTop: 4 },
  chevron: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 17, marginLeft: 12 },
  messages: { flex: 1, marginTop: 10 },
  messagesContent: { paddingTop: 8, paddingBottom: 18, gap: 14 },
  messageRow: { width: '100%', flexDirection: 'row', alignItems: 'flex-end' },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  avatar: { width: 31, height: 31, borderRadius: 16, borderWidth: 1.5, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center', marginRight: 9, backgroundColor: colors.bg },
  avatarText: { color: colors.navy, fontFamily: fonts.bold, fontSize: 12 },
  bubble: { maxWidth: '82%', paddingHorizontal: 17, paddingVertical: 13, borderRadius: 12 },
  userBubble: { backgroundColor: colors.navy, borderBottomRightRadius: 4 },
  coachBubble: { backgroundColor: '#F8F3E8', borderWidth: 1.5, borderColor: colors.navy, borderBottomLeftRadius: 4 },
  suggestionBubble: { backgroundColor: colors.white },
  messageText: { color: colors.navy, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 },
  userMessageText: { color: colors.white },
  quickRow: { flexDirection: 'row', gap: 7, marginBottom: 10 },
  quick: { flex: 1, minHeight: 37, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: colors.soft, paddingHorizontal: 4 },
  quickText: { color: colors.navy, fontFamily: fonts.semibold, fontSize: 11, textAlign: 'center' },
  inputRow: { minHeight: 55, borderRadius: 14, borderWidth: 1.5, borderColor: colors.line, backgroundColor: '#F8F3E8', flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 6 },
  input: { flex: 1, color: colors.navy, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 0 },
  send: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: colors.white, fontFamily: fonts.bold, fontSize: 23, marginTop: -2 },
  pressed: { opacity: 0.66 },
});
