export type PracticeStatus = 'idle' | 'running' | 'paused' | 'finished';

export type PracticeSnapshot = {
  durationSeconds: number;
  remainingSeconds: number;
  questionIndex: number;
  status: PracticeStatus;
};

export function createPracticeSnapshot(durationSeconds: number): PracticeSnapshot {
  const safe = Math.max(30, Math.round(durationSeconds));
  return {
    durationSeconds: safe,
    remainingSeconds: safe,
    questionIndex: 0,
    status: 'idle',
  };
}

export function tickPractice(snapshot: PracticeSnapshot): PracticeSnapshot {
  if (snapshot.status !== 'running') return snapshot;
  const remainingSeconds = Math.max(0, snapshot.remainingSeconds - 1);
  return {
    ...snapshot,
    remainingSeconds,
    status: remainingSeconds === 0 ? 'finished' : 'running',
  };
}

export function advanceQuestion(snapshot: PracticeSnapshot, questionCount: number): PracticeSnapshot {
  if (questionCount <= 0) return snapshot;
  return {
    ...snapshot,
    questionIndex: (snapshot.questionIndex + 1) % questionCount,
  };
}

export function previousQuestion(snapshot: PracticeSnapshot, questionCount: number): PracticeSnapshot {
  if (questionCount <= 0) return snapshot;
  return {
    ...snapshot,
    questionIndex: (snapshot.questionIndex - 1 + questionCount) % questionCount,
  };
}

export function formatPracticeClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function practiceProgress(snapshot: PracticeSnapshot): number {
  if (snapshot.durationSeconds <= 0) return 1;
  return Math.min(1, Math.max(0, 1 - snapshot.remainingSeconds / snapshot.durationSeconds));
}
