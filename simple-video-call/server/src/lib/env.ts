import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .transform((v) => parseInt(v, 10))
    .default("3000"),
  JWT_SECRET: z.string().default("secret"),
  JWT_EXPIRES_IN: z.string().default("1h"),
});

export const env = envSchema.parse(process.env);
