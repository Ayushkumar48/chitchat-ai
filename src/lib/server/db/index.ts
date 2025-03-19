import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { Google } from 'arctic';
import { dev } from '$app/environment';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!env.GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is not set');
if (!env.GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

export const google = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	dev
		? 'http://localhost:5173/login/google/callback'
		: 'https://chitchat-ai.vercel.app/login/google/callback'
);
