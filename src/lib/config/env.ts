import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  CLIENTFLOW_MODE: z
    .enum(["localops", "service_business"])
    .default("localops"),
  CLIENTFLOW_BUSINESS_SLUG: z.string().min(2).default("localops-systems"),
  ADMIN_SESSION_SECRET: z.string().min(16).default("dev-only-change-me-change-me"),
  SEED_ADMIN_EMAIL: z.string().email().default("owner@localopssystems.com"),
  SEED_ADMIN_PASSWORD_HASH: z
    .string()
    .default("replace-me-before-production"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/clientflow",
  APP_BASE_URL: process.env.APP_BASE_URL ?? "http://localhost:3000",
  CLIENTFLOW_MODE: process.env.CLIENTFLOW_MODE ?? "localops",
  CLIENTFLOW_BUSINESS_SLUG:
    process.env.CLIENTFLOW_BUSINESS_SLUG ?? "localops-systems",
  ADMIN_SESSION_SECRET:
    process.env.ADMIN_SESSION_SECRET ?? "dev-only-change-me-change-me",
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL ?? "owner@localopssystems.com",
  SEED_ADMIN_PASSWORD_HASH:
    process.env.SEED_ADMIN_PASSWORD_HASH ?? "replace-me-before-production",
});

export type Env = typeof env;
