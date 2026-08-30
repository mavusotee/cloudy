export default {
  name: "wedding",
  title: "Wedding",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Couple / Project Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) =>
        Rule.required().integer().min(1900).max(2100),
    },

    {
      name: "videos",
      title: "Wedding Videos",
      type: "array",
      of: [
        {
          type: "file",
          options: {
            accept: "video/*",
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(5).error("A wedding can have a maximum of 5 videos."),
    },
  ],

  preview: {
    select: {
      title: "title",
      year: "year",
    },
    prepare({ title, year }) {
      return {
        title: title || "Untitled Wedding",
        subtitle: year ? String(year) : "No year",
      };
    },
  },
};