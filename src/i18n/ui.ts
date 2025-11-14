// src/i18n/ui.ts
export const languages = {
  pap: "Papiamento",
  en: "English",
  nl: "Nederlands",
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = "pap";

// Add keys here for UI chrome (nav, buttons, system messages)
export const ui = {
  pap: {
    "nav.main": "Navegashon prinsipal",
    "nav.spark": "Spark",
    "nav.sustain": "Sustain",
    "nav.about": "Tokante",

    "home.headline": "Ta stima futuro for di aki, no for di otro banda.",
    "home.sub":
      "Creando Futuronan ta un skol prátiko pa diseño i kultura digital riba Aruba. Nos ta duna hubenan i artista nan e hermentnan pa imaginá, konstrui i sostené futuro basa riba realidadnan Caribeño.",

    "footer.tagline": "Diseño i kultura digital for di e islanan, pa e islanan.",
    "footer.cofunded": "Kofinansiá pa Creative Industries Fund NL.",
    "footer.programmes": "Programanan",
    "footer.connect": "Konektá",

    "programme.about": "Tokante e programa",
    "programme.methodologies": "Metodologianan",
    "programme.team": "Ekipo",
    "programme.location": "Kaminda",
    "programme.language": "Idioma",
    "programme.introSession": "Seshon di introdukshon habri",
    "programme.howToApply": "Kon pa apliká",
    "programme.faqs": "Preguntanan Frekuente",

    "about.ourStory": "Nos Historia",
    "about.ourApproach": "Nos Enfoke",
    "about.partners": "Creando ta un obra kolaborativo di",
  },
  en: {
    "nav.main": "Main navigation",
    "nav.spark": "Spark",
    "nav.sustain": "Sustain",
    "nav.about": "About",

    "home.headline": "Building futures from here, not elsewhere.",
    "home.sub":
      "Creando Futuronan is a practical school for design and digital culture in Aruba. We equip young people and artists with the tools to imagine, build, and sustain futures rooted in Caribbean realities.",

    "footer.tagline": "Design & digital culture from the islands, for the islands.",
    "footer.cofunded": "Co-funded by Creative Industries Fund NL.",
    "footer.programmes": "Programs",
    "footer.connect": "Connect",

    "programme.about": "About the programme",
    "programme.methodologies": "Methodologies",
    "programme.team": "Team",
    "programme.location": "Location",
    "programme.language": "Language",
    "programme.introSession": "Open intro session",
    "programme.howToApply": "How to apply",
    "programme.faqs": "FAQs",

    "about.ourStory": "Our Story",
    "about.ourApproach": "Our Approach",
    "about.partners": "Creando is a collaborative work by",
  },
  nl: {
    "nav.main": "Hoofdnavigatie",
    "nav.spark": "Spark",
    "nav.sustain": "Sustain",
    "nav.about": "Over",

    "home.headline": "Toekomsten bouwen van hier, niet van elders.",
    "home.sub":
      "Creando Futuronan is een praktische school voor design en digitale cultuur op Aruba. We geven jongeren en kunstenaars de tools om toekomsten te verbeelden, bouwen en vol te houden, geworteld in Caribische realiteiten.",

    "footer.tagline": "Design en digitale cultuur van de eilanden, voor de eilanden.",
    "footer.cofunded": "Medegefinancierd door Creative Industries Fund NL.",
    "footer.programmes": "Programma's",
    "footer.connect": "Contact",

    "programme.about": "Over het programma",
    "programme.methodologies": "Methodologieën",
    "programme.team": "Team",
    "programme.location": "Locatie",
    "programme.language": "Taal",
    "programme.introSession": "Open introductiesessie",
    "programme.howToApply": "Hoe aanmelden",
    "programme.faqs": "Veelgestelde vragen",

    "about.ourStory": "Ons Verhaal",
    "about.ourApproach": "Onze Aanpak",
    "about.partners": "Creando is een samenwerkingsproject van",
  },
} as const;

export type UiKey = keyof typeof ui[typeof defaultLang];

