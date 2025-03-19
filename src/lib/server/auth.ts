import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { googleAccounts } from '$lib/server/db/schema';

type GoogleUser = {
	googleId: string;
	username: string;
	name: string;
	email: string;
	avatarUrl: string;
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: table.users,
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.users, eq(table.session.userId, table.users.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export async function getUserFromAuthProviderId(authProviderUserId: string) {
	const [existingUser] = await db
		.select()
		.from(table.users)
		.where(eq(table.users.googleId, authProviderUserId));

	return existingUser;
}

export async function createUser(userDetails: GoogleUser) {
	const userId = generateUserId();

	const userRecord: {
		id: string;
		name: string;
		email: string;
		image: string;
		googleId?: string;
	} = {
		id: userId,
		name: userDetails.name,
		email: userDetails.email,
		image: userDetails.avatarUrl
	};
	userRecord.googleId = (userDetails as GoogleUser).googleId;
	try {
		await db.insert(table.users).values(userRecord);
		const [user] = await db.select().from(table.users).where(eq(table.users.id, userId));
		return user;
	} catch (e) {
		console.error(e);
		return null;
	}
}

export async function createGoogleAccount(
	userId: string,
	accessToken: string,
	refreshToken: string,
	expiresAt: number,
	scope: string
) {
	await db
		.insert(googleAccounts)
		.values({
			userId,
			accessToken,
			refreshToken,
			expiresAt,
			scope
		})
		.onConflictDoUpdate({
			target: googleAccounts.userId,
			set: {
				accessToken,
				refreshToken,
				expiresAt,
				scope
			}
		});
}

export async function getGoogleAccount(userId: string) {
	const [account] = await db.select().from(googleAccounts).where(eq(googleAccounts.userId, userId));

	return account;
}
