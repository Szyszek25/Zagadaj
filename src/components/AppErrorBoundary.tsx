import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { fonts } from '../typography';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Zagadaj] render error', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error?.message || 'unknown_error';

    return (
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>COŚ SIĘ WYSYPAŁO</Text>
        <Text style={styles.title}>Zagadaj potrzebuje chwili.</Text>
        <Text style={styles.body}>Spróbuj ponownie. Twój zapisany postęp i onboarding zostają w pamięci urządzenia.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => this.setState({ error: null })}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Spróbuj ponownie</Text>
        </Pressable>
        <Text selectable style={styles.code}>Kod błędu: {message.slice(0, 220)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', paddingHorizontal: 24 },
  eyebrow: { color: colors.teal, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.8 },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 34, lineHeight: 39, letterSpacing: -1, marginTop: 10 },
  body: { color: colors.muted, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, marginTop: 14 },
  button: { height: 54, borderRadius: 14, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  buttonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 16 },
  code: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, marginTop: 18 },
  pressed: { opacity: 0.7 },
});
