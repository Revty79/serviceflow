import { z } from "zod";

const rawEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  SERVICEFLOW_MODE: z
    .enum(["localops", "service_business"])
    .default("localops"),
  SERVICEFLOW_BUSINESS_SLUG: z.string().min(2).default("localops-systems"),
  SERVICEFLOW_SEED_PROFILE: z
    .enum(["localops", "service_business", "electrician"])
    .default("localops"),
  ADMIN_SESSION_SECRET: z.string().min(16).default("dev-only-change-me-change-me"),
  SEED_ADMIN_EMAIL: z.string().email().default("owner@localopssystems.com"),
  SEED_ADMIN_PASSWORD: z.string().min(8).default("change-me-before-production"),
  RESET_SEED_ADMIN_PASSWORD: z.enum(["true", "false"]).default("false"),
  RESET_SEEDED_BUSINESS: z.enum(["true", "false"]).default("false"),
  RESET_SEEDED_SERVICES: z.enum(["true", "false"]).default("false"),
  RESET_SEEDED_INTAKE_QUESTIONS: z.enum(["true", "false"]).default("false"),
});

const rawEnv = rawEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/serviceflow",
  APP_BASE_URL: process.env.APP_BASE_URL ?? "http://localhost:3000",
  SERVICEFLOW_MODE: process.env.SERVICEFLOW_MODE ?? "localops",
  SERVICEFLOW_BUSINESS_SLUG:
    process.env.SERVICEFLOW_BUSINESS_SLUG ?? "localops-systems",
  SERVICEFLOW_SEED_PROFILE: process.env.SERVICEFLOW_SEED_PROFILE ?? "localops",
  ADMIN_SESSION_SECRET:
    process.env.ADMIN_SESSION_SECRET ?? "dev-only-change-me-change-me",
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL ?? "owner@localopssystems.com",
  SEED_ADMIN_PASSWORD:
    process.env.SEED_ADMIN_PASSWORD ?? "change-me-before-production",
  RESET_SEED_ADMIN_PASSWORD: process.env.RESET_SEED_ADMIN_PASSWORD ?? "false",
  RESET_SEEDED_BUSINESS: process.env.RESET_SEEDED_BUSINESS ?? "false",
  RESET_SEEDED_SERVICES: process.env.RESET_SEEDED_SERVICES ?? "false",
  RESET_SEEDED_INTAKE_QUESTIONS:
    process.env.RESET_SEEDED_INTAKE_QUESTIONS ?? "false",
});

export const env = {
  ...rawEnv,
  RESET_SEED_ADMIN_PASSWORD: rawEnv.RESET_SEED_ADMIN_PASSWORD === "true",
  RESET_SEEDED_BUSINESS: rawEnv.RESET_SEEDED_BUSINESS === "true",
  RESET_SEEDED_SERVICES: rawEnv.RESET_SEEDED_SERVICES === "true",
  RESET_SEEDED_INTAKE_QUESTIONS:
    rawEnv.RESET_SEEDED_INTAKE_QUESTIONS === "true",
} as const;

export type Env = typeof env;
