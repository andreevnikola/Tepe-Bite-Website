import { defineField, defineType } from "sanity";

export const newsPostSchema = defineType({
  name: "newsPost",
  title: "Новина",
  type: "document",
  fields: [
    defineField({
      name: "titleBg",
      title: "Заглавие (BG)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Заглавие (EN)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "titleBg", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Дата на публикуване",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Снимка",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "altBg",
          title: "Alt текст (BG)",
          type: "string",
        }),
        defineField({
          name: "altEn",
          title: "Alt текст (EN)",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerptBg",
      title: "Кратко описание (BG)",
      type: "text",
      rows: 3,
      description: "Показва се в списъка с новини (~200 знака)",
    }),
    defineField({
      name: "excerptEn",
      title: "Кратко описание (EN)",
      type: "text",
      rows: 3,
      description: "Shown in the news listing (~200 chars)",
    }),
    defineField({
      name: "bodyBg",
      title: "Съдържание (BG)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bodyEn",
      title: "Съдържание (EN)",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: {
      title: "titleBg",
      subtitle: "publishedAt",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Дата (ново)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
