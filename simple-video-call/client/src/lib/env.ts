import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_URL: z.string().url().default("http://localhost:3000"),
  VITE_WS_URL: z.string().url().default("ws://localhost:3000"),
  VITE_NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(import.meta.env);
