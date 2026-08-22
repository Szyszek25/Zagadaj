export type ChallengeScope = 'today' | 'campus' | 'city';

export type ChallengeDefinition = {
  id: string;
  scope: ChallengeScope;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  opener: string;
  easier: string;
  xp: number;
  durationSeconds: number;
  questions: string[];
};

export const challengeScopes: Array<{ key: ChallengeScope; label: string }> = [
  { key: 'today', label: 'Dziś' },
  { key: 'campus', label: 'Na uczelni' },
  { key: 'city', label: 'W mieście' },
];

export const challenges: Record<ChallengeScope, ChallengeDefinition> = {
  today: {
    id: 'daily-natural-vibe',
    scope: 'today',
    eyebrow: 'DZIŚ',
    title: 'Dzisiejsze\nwyzwanie',
    description: 'Zagadaj dziś do 1 osoby, z którą złapiesz',
    accent: 'naturalny vibe.',
    opener: 'Hej, totalnie znikąd, ale masz bardzo dobrą energię.',
    easier: 'Hej, szybkie pytanie — często tu wpadasz?',
    xp: 20,
    durationSeconds: 300,
    questions: [
      'Co sprawiło, że jesteś dziś właśnie tutaj?',
      'Co ostatnio poprawiło Ci humor?',
      'Masz jakieś miejsce w mieście, do którego zawsze wracasz?',
      'Co robisz, kiedy masz zupełnie wolne popołudnie?',
      'Jaka rzecz ostatnio naprawdę Cię wciągnęła?',
    ],
  },
  campus: {
    id: 'campus-context',
    scope: 'campus',
    eyebrow: 'NA UCZELNI',
    title: 'Zacznij od\nkontekstu',
    description: 'Podejdź do 1 osoby na kampusie i zacznij od tego, co dzieje się',
    accent: 'tu i teraz.',
    opener: 'Ej, wiesz może gdzie tu najlepiej usiąść między zajęciami?',
    easier: 'Hej, też czekasz na te zajęcia?',
    xp: 25,
    durationSeconds: 300,
    questions: [
      'Co najbardziej lubisz w swoim kierunku?',
      'Masz tu jakieś ulubione miejsce na przerwę?',
      'Jak wyglądają u Ciebie najgorsze okienka?',
      'Wolisz uczyć się samemu czy z kimś?',
      'Co byś zmienił/a na tej uczelni od jutra?',
    ],
  },
  city: {
    id: 'city-small-talk',
    scope: 'city',
    eyebrow: 'W MIEŚCIE',
    title: 'Jedna rozmowa\npo drodze',
    description: 'Zacznij krótką rozmowę w kawiarni, kolejce albo parku. Bez presji na',
    accent: 'ciąg dalszy.',
    opener: 'Hej, szybkie pytanie — co tutaj warto zamówić?',
    easier: 'Przepraszam, wiesz może czy tu zawsze jest taki ruch?',
    xp: 30,
    durationSeconds: 300,
    questions: [
      'Jaki jest Twój najlepszy spontaniczny plan w mieście?',
      'Kawiarnia czy spacer — co wybierasz?',
      'Jakie miejsce ostatnio odkryłeś/aś?',
      'Co robisz zwykle po pracy albo zajęciach?',
      'Gdybyś miał/a pokazać komuś jedno miejsce tutaj, co by to było?',
    ],
  },
};

export function getChallenge(scope: ChallengeScope): ChallengeDefinition {
  return challenges[scope] ?? challenges.today;
}

export function cycleScope(scope: ChallengeScope): ChallengeScope {
  if (scope === 'today') return 'campus';
  if (scope === 'campus') return 'city';
  return 'today';
}
