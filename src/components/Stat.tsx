import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { fonts } from '../typography';

type Props = { value: string; label: string; light?: boolean };

export function Stat({ value, label, light = false }: Props) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.value, light && styles.light]}>{value}</Text>
      <Text style={[styles.label, light && styles.lightMuted]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: { width: 55, alignItems: 'center' },
  value: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 17 },
  label: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, marginTop: 2 },
  light: { color: colors.white },
  lightMuted: { color: '#CCD1D1' },
});
