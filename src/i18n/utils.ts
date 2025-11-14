// src/i18n/utils.ts
import { ui, defaultLang, type Lang, type UiKey } from "./ui";

export function normaliseLocale(locale: string | undefined | null): Lang {
  if (!locale) return defaultLang;
  if (locale.startsWith("pap")) return "pap";
  if (locale.startsWith("nl")) return "nl";
  if (locale.startsWith("en")) return "en";
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  const dictionary = ui[lang] ?? ui[defaultLang];

  return (key: UiKey, vars: Record<string, string | number> = {}) => {
    const template = (dictionary[key] ?? ui[defaultLang][key]) as string;

    return Object.entries(vars).reduce(
      (str, [name, value]) => str.replaceAll(`{${name}}`, String(value)),
      template,
    );
  };
}

