import type { ZagadajProfile } from '../contexts/AuthContext';

export const MIN_INTERESTS = 2;
export const MAX_INTERESTS = 6;

export function toggleInterestSelection(current: string[], interest: string): string[] {
  const normalized = interest.trim();
  if (!normalized) return current;
  if (current.includes(normalized)) return current.filter((item) => item !== normalized);
  if (current.length >= MAX_INTERESTS) return current;
  return [...current, normalized];
}

export function isProfileComplete(profile: Partial<ZagadajProfile>): profile is ZagadajProfile {
  return Boolean(
    profile.name?.trim() &&
      profile.context &&
      profile.city?.trim() &&
      profile.goal &&
      profile.confidence &&
      (profile.interests?.length ?? 0) >= MIN_INTERESTS,
  );
}

export function profileCompletion(profile: Partial<ZagadajProfile>): number {
  const checks = [
    Boolean(profile.name?.trim()),
    Boolean(profile.context),
    Boolean(profile.city?.trim()),
    Boolean(profile.goal),
    Boolean(profile.confidence),
    (profile.interests?.length ?? 0) >= MIN_INTERESTS,
  ];
  return checks.filter(Boolean).length / checks.length;
}
