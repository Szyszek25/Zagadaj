import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFile(resolve(ROOT, path), 'utf8');

test('project remains on Expo SDK 54 Snack-compatible stack', async () => {
  const pkg = JSON.parse(await read('package.json')) as { dependencies: Record<string, string>; scripts: Record<string, string> };
  assert.match(pkg.dependencies.expo, /^~54\./);
  assert.match(pkg.dependencies['expo-router'], /^~6\./);
  assert.ok(pkg.dependencies['expo-video']);
  assert.ok(pkg.dependencies['expo-image']);
  assert.ok(pkg.dependencies['@react-navigation/native']);
  assert.ok(pkg.scripts.test);
  assert.ok(pkg.scripts.typecheck);
});

test('root layout keeps safe area, error boundary and state providers', async () => {
  const source = await read('app/_layout.tsx');
  assert.match(source, /SafeAreaProvider/);
  assert.match(source, /AppErrorBoundary/);
  assert.match(source, /AuthProvider/);
  assert.match(source, /ZagadajSessionProvider/);
  assert.match(source, /practice-session/);
});

test('tabs expose the confidence-training product loop', async () => {
  const source = await read('app/(tabs)/_layout.tsx');
  assert.match(source, /animation: 'shift'/);
  assert.match(source, /Redirect href="\/login"/);
  assert.match(source, /Redirect href="\/onboarding"/);
  for (const label of ['Deck', 'Garden', 'Spoty', 'Learn', 'Coach']) {
    assert.ok(source.includes(label), `Missing main tab ${label}`);
  }
  assert.match(source, /name="reels" options=\{\{ href: null \}\}/);
});

test('CardVideo keeps MyCampus-style player safety', async () => {
  const source = await read('src/components/CardVideo.tsx');
  assert.match(source, /MAX_CONCURRENT_PLAYERS = 3/);
  assert.match(source, /useIsFocused/);
  assert.match(source, /isVisible/);
  assert.match(source, /textureView/);
});

test('Garden has progressive visual assets', async () => {
  const source = await read('src/components/GardenScene.tsx');
  assert.match(source, /function Tree/);
  assert.match(source, /pond/);
  assert.match(source, /grown >= 5/);
});

test('Vibe Map stays privacy-safe by design', async () => {
  const source = await read('src/screens/VibeMapScreen.tsx');
  assert.match(source, /zbiorczy sygnał aktywności/);
  assert.match(source, /anonimowych check-inach/);
  assert.doesNotMatch(source, /userLatitude|userLongitude|liveUserLocation/);
});

test('Snack publisher contains the full product flow', async () => {
  const source = await read('scripts/publish-multifile-snack.mjs');
  for (const required of [
    'src/components/AppErrorBoundary.tsx',
    'src/components/CardVideo.tsx',
    'src/components/GardenScene.tsx',
    'src/contexts/AuthContext.tsx',
    'src/domain/onboarding.ts',
    'src/domain/practiceSession.ts',
    'src/screens/PracticeSessionScreen.tsx',
    'src/screens/VibeMapScreen.tsx',
    'src/screens/LearnScreen.tsx',
    'app/(tabs)/spots.tsx',
    'app/(tabs)/learn.tsx',
  ]) {
    assert.ok(source.includes(required), `Snack missing ${required}`);
  }
});
