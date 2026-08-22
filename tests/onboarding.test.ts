import assert from 'node:assert/strict';
import test from 'node:test';
import { isProfileComplete, profileCompletion, toggleInterestSelection } from '../src/domain/onboarding';

test('interest selection adds, removes and caps at six', () => {
  let selected: string[] = [];
  for (const interest of ['Kawa', 'Sport', 'Muzyka', 'Technologia', 'Podróże', 'Filmy', 'Nauka']) {
    selected = toggleInterestSelection(selected, interest);
  }
  assert.equal(selected.length, 6);
  selected = toggleInterestSelection(selected, 'Kawa');
  assert.equal(selected.includes('Kawa'), false);
});

test('profile requires all core answers and at least two interests', () => {
  const complete = {
    name: 'Kuba',
    context: 'student' as const,
    city: 'Warszawa',
    goal: 'confidence' as const,
    confidence: 'medium' as const,
    interests: ['Kawa', 'Technologia'],
  };
  assert.equal(isProfileComplete(complete), true);
  assert.equal(isProfileComplete({ ...complete, interests: ['Kawa'] }), false);
  assert.equal(isProfileComplete({ ...complete, city: '' }), false);
});

test('profile completion is deterministic', () => {
  assert.equal(profileCompletion({}), 0);
  assert.equal(profileCompletion({ name: 'A', city: 'Warszawa' }), 2 / 6);
});
