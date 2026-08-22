import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getChallenge, type ChallengeScope } from '../domain/challenges';
import { practiceRewardForSeconds } from '../domain/practiceSession';

const STORAGE_KEY = 'zagadaj:session:v1';
const HYDRATION_TIMEOUT_MS = 800;

type PersistedSession = {
  xp: number;
  streak: number;
  challengeStarted: boolean;
  completedSessions: number;
  totalPracticeSeconds: number;
  lastPracticeScope: ChallengeScope | null;
};

export type PracticeCompletion = {
  scope: ChallengeScope;
  secondsSpent: number;
  questionsSeen: number;
};

type ZagadajSession = PersistedSession & {
  hydrated: boolean;
  startChallenge: () => void;
  resetChallenge: () => void;
  finishPractice: (completion: PracticeCompletion) => number;
};

const ZagadajSessionContext = createContext<ZagadajSession | null>(null);

export function ZagadajSessionProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(620);
  const [streak, setStreak] = useState(7);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalPracticeSeconds, setTotalPracticeSeconds] = useState(0);
  const [lastPracticeScope, setLastPracticeScope] = useState<ChallengeScope | null>(null);
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
        if (typeof parsed.challengeStarted === 'boolean') setChallengeStarted(parsed.challengeStarted);
        if (typeof parsed.completedSessions === 'number') setCompletedSessions(parsed.completedSessions);
        if (typeof parsed.totalPracticeSeconds === 'number') setTotalPracticeSeconds(parsed.totalPracticeSeconds);
        if (parsed.lastPracticeScope === 'today' || parsed.lastPracticeScope === 'campus' || parsed.lastPracticeScope === 'city') {
          setLastPracticeScope(parsed.lastPracticeScope);
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
    const snapshot: PersistedSession = {
      xp,
      streak,
      challengeStarted,
      completedSessions,
      totalPracticeSeconds,
      lastPracticeScope,
    };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)).catch(() => {});
  }, [challengeStarted, completedSessions, lastPracticeScope, streak, totalPracticeSeconds, xp]);

  const startChallenge = useCallback(() => {
    setChallengeStarted(true);
    void Haptics.selectionAsync().catch(() => {});
  }, []);

  const finishPractice = useCallback((completion: PracticeCompletion) => {
    const safeSeconds = Math.max(0, Math.round(completion.secondsSpent));
    const fullReward = getChallenge(completion.scope).xp;
    const reward = practiceRewardForSeconds(fullReward, safeSeconds);
    if (reward > 0) setXp((value) => value + reward);
    setCompletedSessions((value) => value + 1);
    setTotalPracticeSeconds((value) => value + safeSeconds);
    setLastPracticeScope(completion.scope);
    setChallengeStarted(true);
    return reward;
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
      completedSessions,
      totalPracticeSeconds,
      lastPracticeScope,
      hydrated,
      startChallenge,
      resetChallenge,
      finishPractice,
    }),
    [challengeStarted, completedSessions, finishPractice, hydrated, lastPracticeScope, resetChallenge, startChallenge, streak, totalPracticeSeconds, xp],
  );

  return <ZagadajSessionContext.Provider value={value}>{children}</ZagadajSessionContext.Provider>;
}

export function useZagadajSession() {
  const value = useContext(ZagadajSessionContext);
  if (!value) throw new Error('useZagadajSession must be used inside ZagadajSessionProvider');
  return value;
}
