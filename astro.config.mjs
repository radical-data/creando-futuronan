// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

import favicons from "astro-favicons";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    svelte(),
    favicons({
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
    }),
  ],
});
