import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme';
import { fonts } from '../typography';

type Message = { id: number; side: 'user' | 'coach'; text: string; suggestion?: boolean };

const starter: Message[] = [
  { id: 1, side: 'user', text: 'Chcę zagadać, ale mam pustkę w głowie' },
  { id: 2, side: 'coach', text: 'Spokojnie. Zacznij prosto i lekko.' },
  { id: 3, side: 'coach', text: 'Hej, wyglądasz jak ktoś, kto wie, co tu najlepiej smakuje.', suggestion: true },
  { id: 4, side: 'coach', text: 'Hej, mogę o coś zapytać?', suggestion: true },
];

const replies = [
  'Spróbuj oprzeć się na tym, co dzieje się obok. Jedno krótkie pytanie wystarczy.',
  'Nie szukaj idealnego zdania. Powiedz pierwszą prostą rzecz, która pasuje do sytuacji.',
  'Możesz zacząć od: „Hej, mogę o coś zapytać?” i dopiero potem złapać kontekst.',
];

export function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>(starter);
  const [input, setInput] = useState('');
  const [scenario, setScenario] = useState('ona stoi sama w kolejce po kawę');
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
      current.includes('kawę') ? 'siedzicie obok siebie na uczelni' : 'ona stoi sama w kolejce po kawę',
    );
    void Haptics.selectionAsync().catch(() => {});
  };

  const handleContentSizeChange = () => {
    if (!shouldAutoScrollRef.current) return;
    shouldAutoScrollRef.current = false;
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={18}
    >
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Coach</Text>
        <View style={styles.live} accessibilityLabel="Coach dostępny na żywo">
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Na żywo</Text>
        </View>
      </View>

      <Pressable
        onPress={toggleScenario}
        style={({ pressed }) => [styles.scenario, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Zmień sytuację. Obecnie: ${scenario}`}
      >
        <View style={styles.scenarioCopy}>
          <Text style={styles.scenarioLabel}>Sytuacja</Text>
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
          <View
            key={message.id}
            style={[styles.messageRow, message.side === 'user' ? styles.right : styles.left]}
            accessible
            accessibilityLabel={`${message.side === 'user' ? 'Ty' : 'Coach'}: ${message.text}`}
          >
            {message.side === 'coach' && (
              <View style={styles.avatar} importantForAccessibility="no-hide-descendants">
                <Text style={styles.avatarText}>{message.suggestion ? '✦' : '•ᴗ•'}</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                message.side === 'user' ? styles.userBubble : styles.coachBubble,
                message.suggestion && styles.suggestionBubble,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickRow}>
        {['Prostsza wersja', 'Na uczelni', 'Po rozmowie'].map((item, index) => (
          <Pressable
            key={item}
            onPress={() => {
              void Haptics.selectionAsync().catch(() => {});
              if (index === 0) setInput('Daj mi prostszą wersję');
              if (index === 1) setScenario('siedzicie obok siebie na uczelni');
              if (index === 2) setInput('Co powiedzieć po pierwszym zdaniu?');
            }}
            style={({ pressed }) => [styles.quick, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={item}
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
          placeholder="Opisz sytuację…"
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="send"
          accessibilityLabel="Opisz sytuację Coachowi"
        />
        <Pressable
          onPress={send}
          style={({ pressed }) => [styles.send, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Wyślij wiadomość"
          hitSlop={6}
        >
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.page, paddingBottom: spacing.navHeight + 8 },
  header: { marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 31, letterSpacing: -0.75 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.teal },
  liveText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 13 },
  scenario: {
    marginTop: 25,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    paddingBottom: 13,
  },
  scenarioCopy: { flex: 1 },
  scenarioLabel: { color: colors.teal, fontFamily: fonts.semibold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  scenarioValue: { color: colors.ink, fontFamily: fonts.medium, fontSize: 15, marginTop: 4 },
  chevron: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 17, marginLeft: 12 },
  messages: { flex: 1, marginTop: 14 },
  messagesContent: { paddingTop: 8, paddingBottom: 18, gap: 15 },
  messageRow: { width: '100%', flexDirection: 'row', alignItems: 'flex-end' },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.tealSoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: colors.teal, fontFamily: fonts.bold, fontSize: 12 },
  bubble: { maxWidth: '80%', paddingHorizontal: 17, paddingVertical: 13, borderRadius: 15 },
  userBubble: { backgroundColor: colors.tealSoft },
  coachBubble: { backgroundColor: colors.white },
  suggestionBubble: { maxWidth: '82%', backgroundColor: '#FFFFFF' },
  messageText: { color: colors.ink, fontFamily: fonts.regular, fontSize: 16, lineHeight: 22 },
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  quick: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 8 },
  quickText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 11.5, textAlign: 'center' },
  inputRow: { minHeight: 56, borderRadius: 14, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 7 },
  input: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 0 },
  send: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: colors.white, fontFamily: fonts.bold, fontSize: 23, marginTop: -2 },
  pressed: { opacity: 0.66 },
});
