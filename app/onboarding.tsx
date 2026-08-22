import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';

export default function OnboardingRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <OnboardingScreen />
    </>
  );
}
