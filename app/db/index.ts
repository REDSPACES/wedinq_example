import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as relations from "./relations";
import * as schema from "./schema";

// Transaction pooler使用時は prepare: false が必要
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set");
}
const client = postgres(databaseUrl, { prepare: false });

export const db = drizzle(client, {
	schema: { ...schema, ...relations },
});

// スキーマと型を再エクスポート
export * from "./schema";
