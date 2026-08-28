
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import caseStudy from "./schemaTypes/caseStudy";

export default defineConfig({
  name: "default",
  title: "Cloudhaus Studio",

  projectId: "mq88g3v5",
  dataset: "production",

  basePath: "/studio",

  plugins: [
    structureTool(),
  ],

  schema: {
    types: [caseStudy],
  },
});

