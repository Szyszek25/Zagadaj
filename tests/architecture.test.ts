import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('project remains on Expo SDK 54 Snack-compatible stack', async () => {
  const pkg = JSON.parse(await read('package.json')) as { dependencies: Record<string, string> };
  assert.match(pkg.dependencies.expo, /^~54\./);
  assert.match(pkg.dependencies['expo-router'], /^~6\./);
  assert.ok(pkg.dependencies['expo-video']);
  assert.ok(pkg.dependencies['expo-image']);
});

test('root layout keeps safe area and auth/session providers', async () => {
  const source = await read('app/_layout.tsx');
  assert.match(source, /SafeAreaProvider/);
  assert.match(source, /AuthProvider/);
  assert.match(source, /ZagadajSessionProvider/);
  assert.match(source, /practice-session/);
});

test('tabs keep native shift animation and auth guard', async () => {
  const source = await read('app/(tabs)/_layout.tsx');
  assert.match(source, /animation: 'shift'/);
  assert.match(source, /Redirect href="\/login"/);
  assert.match(source, /Redirect href="\/onboarding"/);
});

test('CardVideo keeps player cap and visibility gating', async () => {
  const source = await read('src/components/CardVideo.tsx');
  assert.match(source, /MAX_CONCURRENT_PLAYERS = 3/);
  assert.match(source, /isVisible/);
  assert.match(source, /textureView/);
});
