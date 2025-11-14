// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import favicons from "astro-favicons";
import sitemap from "@astrojs/sitemap";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://creandofuturonan.org",

  i18n: {
    locales: ["pap", "en", "nl"],
    defaultLocale: "pap",
    fallback: {
      en: "pap",
      nl: "pap",
    },
    routing: {
      prefixDefaultLocale: false, // root `/` is Papiamento
    },
  },
  
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [favicons({
    input: "public/favicon.svg",
    name: "Creando Futuronan",
    short_name: "Creando",
    icons: {
      favicons: true,
      android: true,
      appleIcon: true,
      appleStartup: false,
      windows: true,
      yandex: true,
    },
    withCapo: true,
  }), sitemap(), svelte()],
});