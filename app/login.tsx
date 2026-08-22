import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { LoginScreen } from '../src/screens/LoginScreen';

export default function LoginRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <LoginScreen />
    </>
  );
}
