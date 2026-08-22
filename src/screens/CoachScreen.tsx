import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme';

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

  const nextReply = useMemo(() => replies[messages.length % replies.length], [messages.length]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const base = Date.now();
    setMessages((old) => [
      ...old,
      { id: base, side: 'user', text: trimmed },
      { id: base + 1, side: 'coach', text: nextReply },
    ]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={18}>
      <View style={styles.header}>
        <Text style={styles.title}>Coach</Text>
        <View style={styles.live}><View style={styles.liveDot} /><Text style={styles.liveText}>Na żywo</Text></View>
      </View>

      <Pressable
        onPress={() => setScenario((s) => s.includes('kawę') ? 'siedzicie obok siebie na uczelni' : 'ona stoi sama w kolejce po kawę')}
        style={({ pressed }) => [styles.scenario, pressed && styles.pressed]}
      >
        <Text style={styles.scenarioLabel}>Sytuacja:</Text>
        <Text numberOfLines={1} style={styles.scenarioValue}>{scenario}</Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>

      <ScrollView
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageRow, message.side === 'user' ? styles.right : styles.left]}>
            {message.side === 'coach' && <View style={styles.avatar}><Text style={styles.avatarText}>{message.suggestion ? '✦' : '•ᴗ•'}</Text></View>}
            <View style={[
              styles.bubble,
              message.side === 'user' ? styles.userBubble : styles.coachBubble,
              message.suggestion && styles.suggestionBubble,
            ]}>
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
              if (index === 0) setInput('Daj mi prostszą wersję');
              if (index === 1) setScenario('siedzicie obok siebie na uczelni');
              if (index === 2) setInput('Co powiedzieć po pierwszym zdaniu?');
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
          placeholder="Opisz sytuację…"
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
  header: { marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal },
  liveText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  scenario: { marginTop: 24, height: 54, borderRadius: 18, backgroundColor: colors.soft, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' },
  scenarioLabel: { color: colors.teal, fontSize: 13, fontWeight: '700', marginRight: 6 },
  scenarioValue: { flex: 1, color: colors.ink, fontSize: 13 },
  chevron: { color: colors.muted, fontSize: 16, marginLeft: 8 },
  messages: { flex: 1, marginTop: 16 },
  messagesContent: { paddingTop: 8, paddingBottom: 18, gap: 16 },
  messageRow: { width: '100%', flexDirection: 'row', alignItems: 'flex-end' },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.tealSoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: colors.teal, fontSize: 13, fontWeight: '800' },
  bubble: { maxWidth: '78%', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 20 },
  userBubble: { backgroundColor: colors.tealSoft },
  coachBubble: { backgroundColor: colors.white },
  suggestionBubble: { maxWidth: '80%' },
  messageText: { color: colors.ink, fontSize: 16, lineHeight: 22 },
  quickRow: { flexDirection: 'row', gap: 7, marginBottom: 12 },
  quick: { flex: 1, height: 38, borderRadius: 14, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  quickText: { color: colors.ink, fontSize: 11.5, fontWeight: '600', textAlign: 'center' },
  inputRow: { height: 58, borderRadius: 19, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 8 },
  input: { flex: 1, color: colors.ink, fontSize: 15, paddingVertical: 0 },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: colors.white, fontSize: 23, fontWeight: '700', marginTop: -2 },
  pressed: { opacity: 0.66 },
});
