# Zagadaj

Mobilna aplikacja do ćwiczenia rozpoczynania i podtrzymywania rozmów. Projekt działa na **Expo SDK 54** i jest przygotowany pod Expo Go / Expo Snack.

## Główny flow

```text
start
  -> login
  -> onboarding (6 kroków)
  -> Dziś / Na uczelni / W mieście
  -> 5-minutowa sesja z pytaniami
  -> wynik + XP
  -> Postęp
```

Dolne zakładki:

- **Dziś** — działające konteksty i wyzwania, nie statyczne taby
- **Rolki** — `CardVideo`, filtry, aktywny player, like/save
- **Coach** — lokalny conversational coach z szybkimi wariantami
- **Postęp** — XP, seria, liczba sesji, minuty ćwiczeń i konto

## Architektura

```text
app/
  _layout.tsx
  index.tsx
  login.tsx
  onboarding.tsx
  practice-session.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    reels.tsx
    coach.tsx
    progress.tsx
src/
  components/
    AppErrorBoundary.tsx
    CardVideo.tsx
    Stat.tsx
  contexts/
    AuthContext.tsx
    ZagadajSessionContext.tsx
  domain/
    challenges.ts
    onboarding.ts
    practiceSession.ts
  screens/
  theme.ts
  typography.ts
tests/
```

## System aplikacji

- Expo Router + root Stack + bottom Tabs
- `SafeAreaProvider` / `SafeAreaView` / `useSafeAreaInsets`
- `animation: 'shift'` dla tabów
- splash czeka na hydration stanu
- AsyncStorage zapisuje onboarding, konto demo, XP i metryki ćwiczeń
- minutnik jest deadline-based (`Date.now()`), więc nie dryfuje po backgroundzie
- `CardVideo` zatrzymuje wideo po utracie focusu i ogranicza liczbę playerów
- globalny error boundary zamiast pustego ekranu po błędzie renderowania

## Auth

Obecny auth jest **lokalnym adapterem produktowym** do testowania pełnego flow w Expo Snack/Expo Go. Przyciski Google/Apple pokazują docelowy UX, ale nie używają poświadczeń ani backendu MyCampus. Dzięki temu repo nie kopiuje sekretów ani kont użytkowników z innego produktu.

Warstwa `AuthContext` jest odseparowana od UI, więc można podmienić implementację na Supabase/OAuth bez przebudowy onboardingu i routingu.

## Testy

```bash
npm install
npm test
npm run typecheck
npm run doctor
```

Testy obejmują m.in.:

- minutnik i deadline po backgroundzie,
- pause/resume i zakończenie sesji,
- rotację pytań,
- naliczanie XP,
- kompletność banku wyzwań,
- limity i walidację onboardingu,
- regresję architektury Router/SafeArea/Auth/CardVideo,
- kompletność plików publikowanych do Snacka.

## Expo Snack

```bash
npm run snack:publish
```

Publisher zapisuje wieloplikowy projekt SDK 54 i generuje `SNACK_URL.txt`. GitHub Actions po udanej walidacji dodaje też status **Expo Snack** do commita.

## Typografia

API typografii jest przygotowane pod rodziny Proxima Nova używane w MyCampus. Binaria fontu nie są jeszcze kopiowane automatycznie między repozytoriami; do czasu dołączenia assetów działa bezpieczny systemowy fallback.
