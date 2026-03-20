import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXT_AUTH_SECRET: z.string().min(1),
    NEXT_AUTH_URL: z.string().url().optional(),

    DATABASE_URL: z.string().url(),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    GMAIL_USER: z.string().email(),
    GMAIL_APP_PASSWORD: z.string().min(1),

    API_URL: z.string().url(),
    FRONTEND_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
    NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,

    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    FRONTEND_URL: process.env.FRONTEND_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
