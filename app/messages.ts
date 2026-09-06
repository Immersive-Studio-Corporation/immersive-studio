import id from './locales/id.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';
import tr from './locales/tr.json';
import ru from './locales/ru.json';
import pl from './locales/pl.json';
import nl from './locales/nl.json';
import it from './locales/it.json';
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
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'id', label: 'Bahasa Indonesia' },
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
  it,
  nl,
  pl,
  ru,
  tr,
  ar,
  hi,
  id,
};
export function isLocale(value: string | null): value is Locale {
  return languages.some((language) => language.code === value);
}
