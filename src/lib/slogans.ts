export const HERO_SLOGAN_STEM = 'Empower girls to';

export const EMPOWER_GIRL_PHRASES = [
    'stay in school',
    'lead the way',
    'stay safe',
    'be seen',
    'thrive',
    'keep rising',
] as const;

export type EmpowerGirlPhrase = (typeof EMPOWER_GIRL_PHRASES)[number];

export const SLOGANS = EMPOWER_GIRL_PHRASES.map(
    (phrase) => `${HERO_SLOGAN_STEM} ${phrase}.`,
);
