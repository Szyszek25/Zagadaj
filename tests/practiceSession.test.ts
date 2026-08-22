import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceQuestion, createPracticeSnapshot, formatPracticeClock, practiceProgress, tickPractice } from '../src/domain/practiceSession';

test('practice clock formats minutes and seconds', () => {
  assert.equal(formatPracticeClock(300), '5:00');
  assert.equal(formatPracticeClock(61), '1:01');
  assert.equal(formatPracticeClock(-5), '0:00');
});

test('running session ticks down and finishes at zero', () => {
  let state = { ...createPracticeSnapshot(30), status: 'running' as const };
  for (let i = 0; i < 29; i += 1) state = tickPractice(state);
  assert.equal(state.remainingSeconds, 1);
  assert.equal(state.status, 'running');
  state = tickPractice(state);
  assert.equal(state.remainingSeconds, 0);
  assert.equal(state.status, 'finished');
});

test('paused session does not tick', () => {
  const state = { ...createPracticeSnapshot(120), status: 'paused' as const };
  assert.deepEqual(tickPractice(state), state);
});

test('question navigation wraps around', () => {
  const base = createPracticeSnapshot(300);
  const first = advanceQuestion(base, 3);
  const second = advanceQuestion(first, 3);
  const wrapped = advanceQuestion(second, 3);
  assert.equal(first.questionIndex, 1);
  assert.equal(second.questionIndex, 2);
  assert.equal(wrapped.questionIndex, 0);
});

test('progress is clamped between 0 and 1', () => {
  const base = createPracticeSnapshot(100);
  assert.equal(practiceProgress(base), 0);
  assert.equal(practiceProgress({ ...base, remainingSeconds: 50 }), 0.5);
  assert.equal(practiceProgress({ ...base, remainingSeconds: 0 }), 1);
});
