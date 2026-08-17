export const EMPOWER_GIRL_PHRASES = [
    'stay in school',
    'lead the way',
    'stay safe',
    'be seen',
    'thrive',
    'keep rising',
] as const;

export const SLOGANS = [
    'Pink for courage. Cyan for clarity. Every girl seen.',
    'Breaking cycles. One girl at a time.',
    'Rise. Then reach back.',
    ...EMPOWER_GIRL_PHRASES.map((phrase) => `Empower girls to ${phrase}.`),
] as const;
