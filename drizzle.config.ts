import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./packages/db/tables.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: Bun.env.DATABASE_URL,
	},
});
