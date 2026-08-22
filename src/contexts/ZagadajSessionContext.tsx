import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'zagadaj:session:v1';
const HYDRATION_TIMEOUT_MS = 800;

type PersistedSession = {
  xp: number;
  streak: number;
  challengeStarted: boolean;
};

type ZagadajSession = PersistedSession & {
  hydrated: boolean;
  startChallenge: () => void;
  resetChallenge: () => void;
};

const ZagadajSessionContext = createContext<ZagadajSession | null>(null);

export function ZagadajSessionProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(620);
  const [streak, setStreak] = useState(7);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const didHydrateRef = useRef(false);

  useEffect(() => {
    let alive = true;
    let finished = false;

    const finishHydration = () => {
      if (!alive || finished) return;
      finished = true;
      didHydrateRef.current = true;
      setHydrated(true);
    };

    const timeout = setTimeout(finishHydration, HYDRATION_TIMEOUT_MS);

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!alive || finished || !raw) return;
        const parsed = JSON.parse(raw) as Partial<PersistedSession>;
        if (typeof parsed.xp === 'number') setXp(parsed.xp);
        if (typeof parsed.streak === 'number') setStreak(parsed.streak);
        if (typeof parsed.challengeStarted === 'boolean') {
          setChallengeStarted(parsed.challengeStarted);
        }
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        finishHydration();
      });

    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!didHydrateRef.current) return;
    const snapshot: PersistedSession = { xp, streak, challengeStarted };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)).catch(() => {});
  }, [challengeStarted, streak, xp]);

  const startChallenge = useCallback(() => {
    setChallengeStarted((current) => {
      if (current) return current;
      setXp((value) => value + 20);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      return true;
    });
  }, []);

  const resetChallenge = useCallback(() => {
    setChallengeStarted(false);
    void Haptics.selectionAsync().catch(() => {});
  }, []);

  const value = useMemo<ZagadajSession>(
    () => ({
      xp,
      streak,
      challengeStarted,
      hydrated,
      startChallenge,
      resetChallenge,
    }),
    [challengeStarted, hydrated, resetChallenge, startChallenge, streak, xp],
  );

  return <ZagadajSessionContext.Provider value={value}>{children}</ZagadajSessionContext.Provider>;
}

export function useZagadajSession() {
  const value = useContext(ZagadajSessionContext);
  if (!value) throw new Error('useZagadajSession must be used inside ZagadajSessionProvider');
  return value;
}
