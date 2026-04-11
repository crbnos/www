export const supportedLanguages = [
  "en",
  "es",
  "de",
  "fr",
  "it",
  "ja",
  "pl",
  "pt",
  "ru",
  "zh",
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SupportedLanguage = "en";

export const localeCookieName = "locale";

export const resolveLanguage = (
  locale: string | null | undefined,
): SupportedLanguage => {
  if (!locale) return defaultLanguage;
  const normalized = locale.toLowerCase().split("-")[0];
  if (supportedLanguages.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage;
  }
  return defaultLanguage;
};
