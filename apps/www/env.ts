import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  NEXT_AUTH_SECRET: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

const isServer = typeof window === "undefined";

function validateEnv() {
  try {
    const clientParsed = clientSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });

    if (isServer) {
      const serverParsed = serverSchema.parse({
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
        NODE_ENV: process.env.NODE_ENV,
      });

      return { ...clientParsed, ...serverParsed };
    }

    return clientParsed as z.infer<typeof clientSchema> &
      Partial<z.infer<typeof serverSchema>>;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Invalid environment variables: ${error}`);
    }
    throw new Error("Invalid environment variables");
  }
}

export const env = validateEnv();
