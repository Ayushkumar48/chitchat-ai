import { defineConfig } from 'drizzle-kit';

const DATABASE_URL = process.env.DATABASE_URL;

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: DATABASE_URL as string
	},

	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
