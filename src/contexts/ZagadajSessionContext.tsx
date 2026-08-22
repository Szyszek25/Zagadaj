import React, { createContext, useContext, useMemo, useState } from 'react';

type ZagadajSession = {
  xp: number;
  streak: number;
  challengeStarted: boolean;
  startChallenge: () => void;
};

const ZagadajSessionContext = createContext<ZagadajSession | null>(null);

export function ZagadajSessionProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(620);
  const [challengeStarted, setChallengeStarted] = useState(false);

  const value = useMemo<ZagadajSession>(
    () => ({
      xp,
      streak: 7,
      challengeStarted,
      startChallenge: () => {
        if (!challengeStarted) setXp((current) => current + 20);
        setChallengeStarted(true);
      },
    }),
    [challengeStarted, xp],
  );

  return <ZagadajSessionContext.Provider value={value}>{children}</ZagadajSessionContext.Provider>;
}

export function useZagadajSession() {
  const value = useContext(ZagadajSessionContext);
  if (!value) throw new Error('useZagadajSession must be used inside ZagadajSessionProvider');
  return value;
}
