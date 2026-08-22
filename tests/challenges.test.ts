import assert from 'node:assert/strict';
import test from 'node:test';
import { challengeScopes, cycleScope, getChallenge } from '../src/domain/challenges';

test('all top scopes have complete challenge definitions', () => {
  for (const scope of challengeScopes) {
    const challenge = getChallenge(scope.key);
    assert.equal(challenge.scope, scope.key);
    assert.ok(challenge.title.length > 5);
    assert.ok(challenge.opener.length > 8);
    assert.ok(challenge.questions.length >= 5);
    assert.ok(challenge.durationSeconds >= 60);
    assert.ok(challenge.xp > 0);
  }
});

test('scope cycle is deterministic', () => {
  assert.equal(cycleScope('today'), 'campus');
  assert.equal(cycleScope('campus'), 'city');
  assert.equal(cycleScope('city'), 'today');
});

test('fallback challenge is today', () => {
  assert.equal(getChallenge('today').id, 'daily-natural-vibe');
});
