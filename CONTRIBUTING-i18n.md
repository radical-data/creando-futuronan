# i18n Contributing Guidelines

This document outlines how to work with internationalization (i18n) in the Creando Futuronan project.

## Languages

The site supports three languages:

- **pap** – Papiamento (default, no URL prefix)
- **en** – English (`/en/...`)
- **nl** – Dutch (`/nl/...`)

## Content vs UI Split

### Content (managed in Decap CMS)

Content that editors own and manage through Decap CMS:

- **Events** – Event titles, descriptions, facilitators
- **Programmes** – Programme titles, age ranges, blurbs
- **Open calls** – Application titles, deadlines
- **Partners** – Partner names, blurbs
- **Programme pages** – Full content for Spark/Sustain pages (headlines, schedules, FAQs, etc.)
- **Static pages** – About page content (mission quote, our story, our approach)

**How to edit:** Use Decap CMS at `/admin`. Each collection has language tabs (pap/en/nl) where you can provide translations.

### UI Chrome (managed in code)

UI strings that developers manage in `src/i18n/ui.ts`:

- Navigation labels (`"About"`, `"Spark"`, `"Sustain"`)
- Button text (`"Apply Now"`, `"Learn More"`)
- System messages (`"No events scheduled"`, `"Loading..."`)
- Form labels, aria labels, error messages
- Section headings in layouts (`"About the programme"`, `"Team"`, `"FAQs"`)

**How to edit:** Add keys to `src/i18n/ui.ts` with translations for all three languages, then use `t("key.name")` in components.

## Rules for Contributors

### 1. Adding UI Strings

When you need to add UI text visible to users:

1. **Add to `src/i18n/ui.ts`** with translations for all three languages:

```typescript
export const ui = {
  pap: {
    "mykey.label": "Mi teksto na Papiamento",
  },
  en: {
    "mykey.label": "My text in English",
  },
  nl: {
    "mykey.label": "Mijn tekst in het Nederlands",
  },
};
```

2. **Use in Astro components:**

```astro
---
import { normaliseLocale, useTranslations } from "../i18n/utils";
const lang = normaliseLocale(Astro.currentLocale);
const t = useTranslations(lang);
---

<p>{t("mykey.label")}</p>
```

3. **Use in Svelte components:**

```svelte
<script>
  export let lang = 'pap';
  
  const labels = {
    pap: { myLabel: "Papiamento text" },
    en: { myLabel: "English text" },
    nl: { myLabel: "Nederlandse tekst" },
  };
  
  const l = $derived(labels[lang] ?? labels.pap);
</script>

<p>{l.myLabel}</p>
```

### 2. Adding New Pages

When creating a new page:

1. **Implement once** at `src/pages/mypage.astro`
2. **Make it locale-aware:**
   - Get current locale: `const lang = normaliseLocale(Astro.currentLocale);`
   - Filter content collections: `collection.filter((item) => item.id.startsWith(`${lang}/`))`
3. **Create wrappers** for other locales:
   - `src/pages/en/mypage.astro` → imports `../mypage.astro`
   - `src/pages/nl/mypage.astro` → imports `../mypage.astro`

### 3. Adding New Svelte Islands

When creating interactive components:

1. **Accept a `lang` prop:**

```svelte
<script>
  let { lang = 'pap' } = $props();
</script>
```

2. **Create a local labels dictionary:**

```svelte
const labels = {
  pap: { title: "Titulo" },
  en: { title: "Title" },
  nl: { title: "Titel" },
};

const l = $derived(labels[lang] ?? labels.pap);
```

3. **Pass `lang` from parent Astro components:**

```astro
<MyComponent lang={lang} client:visible />
```

### 4. Working with Content Collections

Content files live in locale subfolders:

```
src/content/
  events/
    pap/
      2025-11-15-event.json
    en/
      2025-11-15-event.json
    nl/
      2025-11-15-event.json
```

**Filtering by locale in code:**

```typescript
import { getCollection } from "astro:content";

function entryMatchesLocale(entryId: string, lang: Lang) {
  return entryId.startsWith(`${lang}/`);
}

const events = (await getCollection("events"))
  .filter((e) => entryMatchesLocale(e.id, lang));
```

### 5. Language Switcher

The language switcher (`src/components/LanguageSwitcher.astro`) derives the `pageId` from the current path by stripping locale prefixes and normalizing the route. It automatically handles standard routes like `/`, `/about`, `/spark`, `/sustain`, and `/events`. If you add new pages, the switcher should continue to work as long as they follow the same routing pattern.

### 6. Date Formatting

Use the `localeForDates()` helper to format dates per locale:

```typescript
import { localeForDates } from "../i18n/dates";

const dateLocale = localeForDates(lang); // "pap-AW", "en-AW", or "nl-NL"
const formatted = new Date(dateISO).toLocaleDateString(dateLocale, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
```

## Configuration

### Do NOT Change Without Agreement

- **`astro.config.mjs`** – `i18n` block (locales, defaultLocale, routing)
- **`public/admin/config.yml`** – Top-level `i18n` configuration
- Locale folder structure (`pap/en/nl`)

These are architectural decisions. Changing them will break the i18n system.

## QA Checklist

Before merging i18n-related changes:

### Routing

- [ ] `/` loads Papiamento content, `<html lang="pap">`
- [ ] `/en` loads English content, `<html lang="en">`
- [ ] `/nl` loads Dutch content, `<html lang="nl">`
- [ ] `/about`, `/spark`, `/sustain`, `/events` work for all locales

### Language Switcher

- [ ] Displays "Papiamento / English / Nederlands" (text only, no flags)
- [ ] Keeps you on the same page (home→home, about→about, etc.)
- [ ] Uses `aria-current="page"` for the active language
- [ ] Active language is bold and underlined

### Content

- [ ] Events, programmes, partners, open calls show correct locale-specific content
- [ ] No English text appears on Papiamento pages (except proper nouns)
- [ ] No Papiamento text appears on English/Dutch pages

### UI Strings

- [ ] All navigation labels are translated
- [ ] All button text is translated (`"Apply Now"`, `"Learn More"`, etc.)
- [ ] All system messages are translated (`"No events scheduled"`, etc.)
- [ ] All form labels, placeholders, and error messages are translated

### Svelte Islands

- [ ] EventsCalendar displays translated labels (calendar/list views, month names, etc.)
- [ ] UrgencyBanner displays translated urgency messages
- [ ] All interactive components respect the `lang` prop

### Decap CMS

- [ ] Shows pap/en/nl tabs for each i18n-enabled collection
- [ ] Changing text in one locale only affects that locale's routes
- [ ] Preview links work correctly for each locale

### Build

- [ ] `pnpm build` passes with no TypeScript errors
- [ ] No stray `Lang` or `UiKey` type errors
- [ ] All pages render without errors in dev mode

## Troubleshooting

### "Cannot find module" errors after adding new pages

Run `pnpm build` to regenerate Astro's type definitions.

### Content not showing up

1. Check that the file is in the correct locale folder (e.g., `events/pap/`)
2. Check that `entryMatchesLocale()` is being used to filter collections
3. Check that the content file has valid JSON and matches the schema in `src/content/config.ts`

### Language switcher not working

1. Check that the page has a locale wrapper (e.g., `en/mypage.astro`)
2. Check that the `pageId` mapping in `LanguageSwitcher.astro` includes your page
3. Check that `getRelativeLocaleUrl()` is being called with the correct pageId

### Decap CMS not showing locale tabs

1. Check that `i18n: true` is set at the collection level in `config.yml`
2. Check that fields have either `i18n: true` or `i18n: duplicate`
3. Check that the top-level `i18n` block exists in `config.yml`

## Additional Resources

- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Decap CMS i18n](https://decapcms.org/docs/i18n/)
- Project plan: See `/implement-i18n.plan.md` for full architecture details

