import { sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => sql`gen_random_uuid()`),
	googleId: text('google_id'),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password'),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const session = pgTable('session', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => sql`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const messages = pgTable('message', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => sql`gen_random_uuid()`),
	chatId: text('chatId')
		.notNull()
		.references(() => chats.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	role: text('role').notNull(),
	createdAt: timestamp('createdAt', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const chats = pgTable('chats', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => sql`gen_random_uuid()`),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('createdAt', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	lastUsed: timestamp('lastUsed', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const googleAccounts = pgTable('google_accounts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => sql`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
	accessToken: text('access_token').notNull(),
	refreshToken: text('refresh_token').notNull(),
	expiresAt: integer('expires_at').notNull(),
	scope: text('scope').notNull()
});

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;

export type GoogleAccount = typeof googleAccounts.$inferSelect;
export type NewGoogleAccount = typeof googleAccounts.$inferInsert;
