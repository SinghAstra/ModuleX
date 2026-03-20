import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().transform(Number).default(5000),
  AUTH_SECRET: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
