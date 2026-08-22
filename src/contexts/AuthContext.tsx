import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'zagadaj:auth:v1';

type AuthMethod = 'google' | 'apple' | 'email' | 'guest';

export type ZagadajProfile = {
  name: string;
  context: 'student' | 'work' | 'other';
  city: string;
  goal: 'confidence' | 'friends' | 'dating' | 'networking';
  confidence: 'low' | 'medium' | 'high';
  interests: string[];
};

type PersistedAuth = {
  signedIn: boolean;
  onboarded: boolean;
  method: AuthMethod | null;
  email: string | null;
  profile: ZagadajProfile | null;
};

type AuthContextValue = PersistedAuth & {
  hydrated: boolean;
  signIn: (method: AuthMethod, email?: string) => Promise<void>;
  completeOnboarding: (profile: ZagadajProfile) => Promise<void>;
  signOut: () => Promise<void>;
};

const DEFAULT_AUTH: PersistedAuth = {
  signedIn: false,
  onboarded: false,
  method: null,
  email: null,
  profile: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedAuth>(DEFAULT_AUTH);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(AUTH_STORAGE_KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        const parsed = JSON.parse(raw) as Partial<PersistedAuth>;
        setState({
          signedIn: parsed.signedIn === true,
          onboarded: parsed.onboarded === true,
          method: parsed.method ?? null,
          email: parsed.email ?? null,
          profile: parsed.profile ?? null,
        });
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setHydrated(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback(async (next: PersistedAuth) => {
    setState(next);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const signIn = useCallback(
    async (method: AuthMethod, email?: string) => {
      const next: PersistedAuth = {
        ...state,
        signedIn: true,
        method,
        email: email?.trim().toLowerCase() || null,
      };
      await persist(next);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    },
    [persist, state],
  );

  const completeOnboarding = useCallback(
    async (profile: ZagadajProfile) => {
      const next: PersistedAuth = {
        ...state,
        signedIn: true,
        onboarded: true,
        profile,
      };
      await persist(next);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    },
    [persist, state],
  );

  const signOut = useCallback(async () => {
    await persist(DEFAULT_AUTH);
    void Haptics.selectionAsync().catch(() => {});
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, hydrated, signIn, completeOnboarding, signOut }),
    [completeOnboarding, hydrated, signIn, signOut, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
