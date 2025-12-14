import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

// Transaction pooler使用時は prepare: false が必要
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, {
	schema: { ...schema, ...relations },
});

// スキーマと型を再エクスポート
export * from "./schema";
