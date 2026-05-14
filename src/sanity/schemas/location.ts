import { defineField, defineType } from "sanity";

const LINK_ICONS = [
  { title: "Instagram", value: "instagram" },
  { title: "TikTok", value: "tiktok" },
  { title: "Facebook", value: "facebook" },
  { title: "Уебсайт", value: "website" },
  { title: "Друго (Random)", value: "random" },
];

export const locationSchema = defineType({
  name: "location",
  title: "Партньорска локация",
  type: "document",
  fields: [
    defineField({
      name: "nameBg",
      title: "Име на магазина (BG)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameEn",
      title: "Име на магазина (EN)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "nameBg", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Снимка на магазина",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt текст",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "neighborhood",
      title: "Квартал / Район",
      type: "string",
      description: 'Напр. "Капана", "Старинна", "Тракия"',
    }),
    defineField({
      name: "address",
      title: "Адрес",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coordinates",
      title: "Координати",
      type: "object",
      fields: [
        defineField({ name: "lat", title: "Ширина (lat)", type: "number" }),
        defineField({ name: "lng", title: "Дължина (lng)", type: "number" }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descriptionBg",
      title: "Описание (BG)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "descriptionEn",
      title: "Описание (EN)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "links",
      title: "Линкове",
      type: "array",
      of: [
        {
          type: "object",
          name: "locationLink",
          title: "Линк",
          fields: [
            defineField({
              name: "url",
              title: "URL адрес",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "labelBg",
              title: "Надпис (BG)",
              type: "string",
            }),
            defineField({
              name: "labelEn",
              title: "Надпис (EN)",
              type: "string",
            }),
            defineField({
              name: "icon",
              title: "Лого / Икона",
              type: "string",
              options: {
                list: LINK_ICONS,
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "labelBg", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "partneringSince",
      title: "Партньор от",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Активна локация",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "nameBg",
      subtitle: "address",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Партньор от (ново)",
      name: "partneringSinceDesc",
      by: [{ field: "partneringSince", direction: "desc" }],
    },
    {
      title: "Азбучен ред",
      name: "nameAsc",
      by: [{ field: "nameBg", direction: "asc" }],
    },
  ],
});
