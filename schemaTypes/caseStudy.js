import { defineField, defineType } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",

  fields: [
    // =========================================================
    // PROJECT TITLE
    // =========================================================

    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // =========================================================
    // SLUG
    // =========================================================

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",

      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-"),
      },
    }),

    // =========================================================
    // CLIENT
    // =========================================================

    defineField({
      name: "client",
      title: "Client",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // =========================================================
    // HERO VIDEOS
    // =========================================================

    defineField({
  name: "heroVideos",
  title: "Hero Videos",
  description:
    "Upload one or more videos or add Cloudinary video URLs for the project hero.",
  type: "array",

  of: [
    {
      type: "file",
      options: {
        accept: "video/*",
      },
    },
    {
      type: "object",
      name: "cloudinaryVideo",
      title: "Cloudinary Video",
      fields: [
        defineField({
          name: "url",
          title: "Cloudinary URL",
          type: "url",
          validation: (Rule) => Rule.required(),
        }),
      ],
    },
  ],
}),

    // =========================================================
    // PROJECT OVERVIEW
    // =========================================================

    defineField({
      name: "overview",
      title: "Project Overview",
      type: "text",
      rows: 6,
    }),

    // =========================================================
    // SERVICES
    // =========================================================

    defineField({
      name: "services",
      title: "Services",
      type: "array",

      of: [
        {
          type: "string",
        },
      ],
    }),

    // =========================================================
    // DATE
    // =========================================================

    defineField({
      name: "date",
      title: "Date",
      type: "string",
    }),

    // =========================================================
    // GALLERY
    // =========================================================

    defineField({
      name: "gallery",
      title: "Gallery",

      description:
        "Upload up to 16 images or videos. Portrait and landscape media are supported.",

      type: "array",

      validation: (Rule) =>
        Rule.max(16).error(
          "You can upload a maximum of 16 gallery items."
        ),

      options: {
        layout: "grid",
      },

      of: [
        {
          type: "image",

          options: {
            hotspot: true,
          },
        },
        {
          type: "file",

          options: {
            accept: "video/*",
          },
        },
      ],
    }),
  ],

  // ===========================================================
  // DOCUMENT PREVIEW
  // ===========================================================

  preview: {
    select: {
      title: "title",
      client: "client",
      media: "gallery.0",
    },

    prepare({ title, client, media }) {
      return {
        title: title || "Untitled Project",
        subtitle: client || "No client",
        media,
      };
    },
  },
});