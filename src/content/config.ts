import { defineCollection, z } from "astro:content";

const events = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    island: z.enum(["Aruba", "Bonaire", "Curaçao", "Online"]),
    dateISO: z.coerce.date(),
    href: z.string(),
    programme: z.enum(["spark", "sustain"]).optional(),
    type: z.string().optional(),
    facilitators: z.string().optional(),
  }),
});

const partners = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      href: z.string().optional(),
      logo: image(),
      blurb: z.string().optional(),
    }),
});

const programmes = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    age: z.string(),
    blurb: z.string(),
    href: z.string(),
  }),
});

const openCalls = defineCollection({
  type: "data",
  schema: z.object({
    programme: z.enum(["spark", "sustain"]),
    title: z.string(),
    openISO: z.coerce.date().optional(),
    closeISO: z.coerce.date().optional(),
    applyLink: z.string(),
  }),
});

const programmePages = defineCollection({
  type: "data",
  schema: z.object({
    slug: z.string(),
    headline: z.string(),
    sub: z.string(),
    aboutContent: z.string(),
    schedule: z.string(),
    methodologies: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    team: z.string(),
    location: z.string(),
    language: z.string(),
    introSession: z.string().optional(),
    applicationInfo: z.string(),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
});

const pages = defineCollection({
  type: "data",
  schema: z.object({
    slug: z.string(),
    missionQuote: z.string(),
    ourStory: z.object({
      heading: z.string(),
      content: z.string(),
    }),
    ourApproach: z.object({
      heading: z.string(),
      content: z.string(),
    }),
  }),
});

export const collections = {
  events,
  partners,
  programmes,
  "open-calls": openCalls,
  "programme-pages": programmePages,
  pages,
};
