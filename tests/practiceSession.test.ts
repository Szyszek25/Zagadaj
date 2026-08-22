import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceQuestion,
  createPracticeDeadline,
  createPracticeSnapshot,
  formatPracticeClock,
  practiceProgress,
  practiceRewardForSeconds,
  remainingSecondsAt,
  syncPracticeToDeadline,
  tickPractice,
  type PracticeSnapshot,
} from '../src/domain/practiceSession';

test('practice clock formats minutes and seconds', () => {
  assert.equal(formatPracticeClock(300), '5:00');
  assert.equal(formatPracticeClock(61), '1:01');
  assert.equal(formatPracticeClock(-5), '0:00');
});

test('running session ticks down and finishes at zero', () => {
  let state: PracticeSnapshot = { ...createPracticeSnapshot(30), status: 'running' };
  for (let i = 0; i < 29; i += 1) state = tickPractice(state);
  assert.equal(state.remainingSeconds, 1);
  state = tickPractice(state);
  assert.equal(state.remainingSeconds, 0);
  assert.equal(state.status, 'finished');
});

test('deadline clock survives delayed ticks and background time', () => {
  const now = 1_000_000;
  const deadline = createPracticeDeadline(now, 300);
  assert.equal(remainingSecondsAt(deadline, now + 61_500), 239);

  const running: PracticeSnapshot = { ...createPracticeSnapshot(300), status: 'running' };
  const synced = syncPracticeToDeadline(running, deadline, now + 301_000);
  assert.equal(synced.remainingSeconds, 0);
  assert.equal(synced.status, 'finished');
});

test('paused session does not tick or sync', () => {
  const state: PracticeSnapshot = { ...createPracticeSnapshot(120), status: 'paused' };
  assert.deepEqual(tickPractice(state), state);
  assert.deepEqual(syncPracticeToDeadline(state, 1000, 5000), state);
});

test('question navigation wraps around and can jump after background', () => {
  const base = createPracticeSnapshot(300);
  const first = advanceQuestion(base, 3);
  const jumped = advanceQuestion(first, 3, 2);
  assert.equal(first.questionIndex, 1);
  assert.equal(jumped.questionIndex, 0);
});

test('progress is clamped between 0 and 1', () => {
  const base = createPracticeSnapshot(100);
  assert.equal(practiceProgress(base), 0);
  assert.equal(practiceProgress({ ...base, remainingSeconds: 50 }), 0.5);
  assert.equal(practiceProgress({ ...base, remainingSeconds: 0 }), 1);
});

test('reward is proportional and never exceeds full reward', () => {
  assert.equal(practiceRewardForSeconds(20, 300), 20);
  assert.equal(practiceRewardForSeconds(25, 240), 25);
  assert.equal(practiceRewardForSeconds(30, 90), 15);
  assert.equal(practiceRewardForSeconds(20, 20), 5);
  assert.equal(practiceRewardForSeconds(20, 5), 0);
});
