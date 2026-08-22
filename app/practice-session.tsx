import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { PracticeSessionScreen } from '../src/screens/PracticeSessionScreen';

export default function PracticeSessionRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <PracticeSessionScreen />
    </>
  );
}
