import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { ReelsScreen } from '../../src/screens/ReelsScreen';
import { colors } from '../../src/theme';

export default function ReelsRoute() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <StatusBar style="light" />
      <ReelsScreen />
    </View>
  );
}
