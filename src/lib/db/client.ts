import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/config/env";
import * as schema from "./schema";

type GlobalSqlClient = typeof globalThis & {
  __serviceflow_sql__?: ReturnType<typeof postgres>;
};

const globalClient = globalThis as GlobalSqlClient;

const sql =
  globalClient.__serviceflow_sql__ ??
  postgres(env.DATABASE_URL, {
    prepare: false,
  });

if (env.NODE_ENV !== "production") {
  globalClient.__serviceflow_sql__ = sql;
}

export const db = drizzle(sql, { schema });
