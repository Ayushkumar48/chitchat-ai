import { decodeIdToken } from 'arctic';
import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { db, google } from '$lib/server/db';
import { googleAccounts } from '$lib/server/db/schema';
import {
	createSession,
	createUser,
	generateSessionToken,
	getUserFromAuthProviderId,
	setSessionTokenCookie
} from '$lib/server/auth';

type GoogleClaims = {
	sub: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
	locale?: string;
};

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		console.error(e);
		return new Response(null, {
			status: 400
		});
	}
	const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
	const googleUserId = claims.sub;

	const existingUser = await getUserFromAuthProviderId(googleUserId);

	if (existingUser) {
		await db
			.insert(googleAccounts)
			.values({
				userId: existingUser.id,
				accessToken: tokens.accessToken(),
				refreshToken: tokens.refreshToken(),
				expiresAt: tokens.accessTokenExpiresInSeconds(),
				scope: tokens.scopes().join(' ')
			})
			.onConflictDoUpdate({
				target: googleAccounts.userId,
				set: {
					accessToken: tokens.accessToken(),
					refreshToken: tokens.refreshToken(),
					expiresAt: tokens.accessTokenExpiresInSeconds(),
					scope: tokens.scopes().join(' ')
				}
			});

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/chat/today'
			}
		});
	}
	const userDetails = {
		googleId: googleUserId,
		email: claims.email || '',
		username: claims.email?.split('@')[0] || '',
		name: claims.name || '',
		avatarUrl: claims.picture || '',
		bio: ''
	};

	const user = await createUser(userDetails);

	if (user) {
		// Create googleAccounts entry for the new user
		await db.insert(googleAccounts).values({
			userId: user.id,
			accessToken: tokens.accessToken(),
			refreshToken: tokens.refreshToken(),
			expiresAt: tokens.accessTokenExpiresInSeconds(),
			scope: tokens.scopes().join(' ')
		});

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/chat/today'
			}
		});
	}
	return new Response(null, {
		status: 400
	});
}
