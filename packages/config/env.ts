import { z } from "zod";

/**
 * Server-side environment variables schema
 * These should never be exposed to the client
 */
export const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  // API
  JWT_SECRET: z.string().min(32),
  API_KEY_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("4000"),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // Blockchain (allow empty strings for optional fields)
  ETHEREUM_RPC_URL: z.string().optional().or(z.literal("")),
  SOLANA_RPC_URL: z.string().optional().or(z.literal("")),
  PRIVATE_KEY_ENCRYPTION_KEY: z.string().min(10),

  // Fiat Bridge
  MOONPAY_API_KEY: z.string().optional(),
  MOONPAY_SECRET_KEY: z.string().optional(),
  TRANSAK_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_ISSUING_CARD_ID: z.string().optional(),

  // Web Scraping
  SERP_API_KEY: z.string().optional(),
  SCRAPING_API_KEY: z.string().optional(),

  // Airline APIs
  AMADEUS_API_KEY: z.string().optional(),
  AMADEUS_API_SECRET: z.string().optional(),
  SKYSCANNER_API_KEY: z.string().optional(),
});

/**
 * Client-side environment variables schema
 * These are safe to expose to the browser
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string(),
  NEXT_PUBLIC_ALCHEMY_ID: z.string(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validate and parse server environment variables
 */
export function validateServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid server environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}

/**
 * Validate and parse client environment variables
 */
export function validateClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  });

  if (!parsed.success) {
    console.error("❌ Invalid client environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
}

