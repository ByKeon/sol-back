export const LIST_Lang = [
  'en',
  'tw',
  'cn',
  'ja',
  'ko',
  'de',
  'es',
  'fr',
  'pt',
  'ru',
  'ar',
] as const;
export type TYPE_Lang = (typeof LIST_Lang)[number];
