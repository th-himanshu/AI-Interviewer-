import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials:{
   url: 'postgresql://neondb_owner:npg_NCXVEr4S1eBl@ep-blue-glitter-adh107vo-pooler.c-2.us-east-1.aws.neon.tech/ai-interview-mocker?sslmode=require&channel_binding=require',
  },
});
