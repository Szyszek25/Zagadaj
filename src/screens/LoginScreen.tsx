import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';
import { fonts } from '../typography';

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const emailOk = useMemo(() => /^\S+@\S+\.\S+$/.test(email.trim()), [email]);

  const run = async (method: 'google' | 'apple' | 'email' | 'guest') => {
    if (busy) return;
    if (method === 'email' && !emailOk) return;
    setBusy(true);
    try {
      await signIn(method, method === 'email' ? email : undefined);
      router.replace('/onboarding');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top + 14, paddingBottom: Math.max(insets.bottom, 18) }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.top}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>Zagadaj</Text>
          <View style={styles.dot} />
        </View>
        <Text style={styles.kicker}>Mniej analizowania. Więcej prawdziwych rozmów.</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>Pierwsze zdanie{`\n`}nie musi być idealne.</Text>
        <Text style={styles.subtitle}>
          Codzienne mikro-wyzwania, prawdziwe przykłady i sesje z pytaniami, które pomagają po prostu zacząć.
        </Text>
      </View>

      <View style={styles.form}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kontynuuj z Google"
          onPress={() => void run('google')}
          style={({ pressed }) => [styles.oauth, pressed && styles.pressed]}
        >
          <Ionicons name="logo-google" size={20} color={colors.ink} />
          <Text style={styles.oauthText}>Kontynuuj z Google</Text>
        </Pressable>

        {Platform.OS === 'ios' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kontynuuj z Apple"
            onPress={() => void run('apple')}
            style={({ pressed }) => [styles.oauth, styles.apple, pressed && styles.pressed]}
          >
            <Ionicons name="logo-apple" size={21} color={colors.white} />
            <Text style={[styles.oauthText, styles.appleText]}>Kontynuuj z Apple</Text>
          </Pressable>
        ) : null}

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.or}>albo</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.emailWrap}>
          <Ionicons name="mail-outline" size={19} color={colors.muted} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Twój e-mail"
            placeholderTextColor={colors.muted}
            style={styles.input}
            returnKeyType="go"
            onSubmitEditing={() => void run('email')}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !emailOk || busy }}
          onPress={() => void run('email')}
          style={({ pressed }) => [styles.primary, (!emailOk || busy) && styles.disabled, pressed && emailOk && styles.pressed]}
        >
          {busy ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryText}>Dalej</Text>}
        </Pressable>

        <Pressable onPress={() => void run('guest')} hitSlop={12} style={styles.guest}>
          <Text style={styles.guestText}>Podejrzyj bez konta</Text>
        </Pressable>
      </View>

      <Text style={styles.legal}>Kontynuując, akceptujesz zasady społeczności i politykę prywatności.</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 22, justifyContent: 'space-between' },
  top: { gap: 7 },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start' },
  brand: { color: colors.ink, fontFamily: fonts.bold, fontSize: 30, letterSpacing: -0.9 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal, marginLeft: 5, marginTop: 7 },
  kicker: { color: colors.muted, fontFamily: fonts.medium, fontSize: 13 },
  hero: { marginTop: 22 },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 38, lineHeight: 41, letterSpacing: -1.35 },
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: 16, lineHeight: 23, marginTop: 16, maxWidth: 350 },
  form: { gap: 10 },
  oauth: { height: 54, borderRadius: 14, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  apple: { backgroundColor: colors.ink, borderColor: colors.ink },
  oauthText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16 },
  appleText: { color: colors.white },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginVertical: 4 },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  or: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12 },
  emailWrap: { height: 54, borderRadius: 14, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  input: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 16, paddingVertical: 0 },
  primary: { height: 54, borderRadius: 14, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontFamily: fonts.bold, fontSize: 17 },
  disabled: { opacity: 0.42 },
  guest: { alignItems: 'center', paddingVertical: 8 },
  guestText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 14, textDecorationLine: 'underline' },
  legal: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, lineHeight: 15, textAlign: 'center', paddingHorizontal: 16 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
});
