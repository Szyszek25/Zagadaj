import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../src/contexts/AuthContext';

export default function IndexRoute() {
  const { hydrated, signedIn, onboarded } = useAuth();
  if (!hydrated) return null;
  if (!signedIn) return <Redirect href="/login" />;
  if (!onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
