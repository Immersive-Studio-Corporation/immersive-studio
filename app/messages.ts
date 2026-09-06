import fr from './locales/fr.json';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import pt from './locales/pt.json';
export const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '简体中文' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'pt', label: 'Português' },
] as const;
export type Locale = (typeof languages)[number]['code'];
export type Messages = typeof fr;
export const dictionaries: Record<Locale, Messages> = {
  fr,
  en,
  de,
  es,
  zh,
  ko,
  ja,
  pt,
};
export function isLocale(value: string | null): value is Locale {
  return languages.some((language) => language.code === value);
}
