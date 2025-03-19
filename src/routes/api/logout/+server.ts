import { deleteSessionTokenCookie, invalidateSession, sessionCookieName } from '$lib/server/auth';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	const sessionId = event.cookies.get(sessionCookieName);
	if (sessionId) {
		await invalidateSession(sessionId);
		deleteSessionTokenCookie(event);
	}
	return json({ success: true });
}
