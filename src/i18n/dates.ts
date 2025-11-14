// src/i18n/dates.ts
import type { Lang } from "./ui";

export function localeForDates(lang: Lang): string {
  switch (lang) {
    case "pap":
      return "pap-AW"; // or "en-AW" if `pap-AW` is not widely supported by engines
    case "nl":
      return "nl-NL";
    case "en":
    default:
      return "en-AW";
  }
}

