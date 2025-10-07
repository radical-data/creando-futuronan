import { defineCollection, z } from "astro:content";

const events = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    island: z.enum(["Aruba", "Bonaire", "Curaçao", "Online"]),
    dateISO: z.coerce.date(),
    href: z.string(),
    programme: z.enum(["spark", "sustain"]).optional(),
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

export const collections = {
  events,
  partners,
  programmes,
  "open-calls": openCalls,
};
