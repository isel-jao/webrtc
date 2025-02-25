import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .transform((v) => parseInt(v, 10))
    .default("3000"),
});

export const env = envSchema.parse(process.env);
