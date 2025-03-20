import { json } from '@sveltejs/kit';
import { google } from 'googleapis';
import { getGoogleAccount } from '$lib/server/auth';

interface EventData {
	summary?: string;
	location?: string;
	attendees?: {
		email?: string;
		displayName?: string;
	}[];
	start: {
		dateTime: string;
		timeZone: string;
	};
	end: {
		dateTime: string;
		timeZone: string;
	};
}

async function createCalendarEvent(accessToken: string, event: EventData) {
	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });
	const calendar = google.calendar({ version: 'v3', auth });

	try {
		const response = await calendar.events.insert({
			calendarId: 'primary',
			requestBody: event,
			sendUpdates: 'all'
		});
		return response.data;
	} catch (error) {
		console.error('Error creating event:', error);
		throw error;
	}
}

async function createGoogleCalendarEvent(userId: string, eventData: EventData) {
	const googleAccount = await getGoogleAccount(userId);

	if (!googleAccount) {
		throw new Error('No linked Google account found.');
	}

	return await createCalendarEvent(googleAccount.accessToken, eventData);
}

export async function POST({ request, locals }) {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const userId = locals.session.userId;

		const eventData = await request.json();

		if (!eventData) {
			return json({ error: 'Event data is required' }, { status: 400 });
		}

		const [hours, minutes] = eventData.time.split(':');

		const createdEvent = await createGoogleCalendarEvent(userId, {
			summary: `Meeting with ${eventData.people.join(', ')}`,
			location: eventData.places[0],
			attendees: eventData.people.map((person: string) => ({
				email: locals.user?.email,
				displayName: person
			})),
			start: {
				dateTime: new Date(
					new Date(eventData.date).setHours(Number(hours), Number(minutes), 0, 0)
				).toISOString(),
				timeZone: 'Asia/Kolkata'
			},
			end: {
				dateTime: new Date(
					new Date(eventData.date).setHours(Number(hours) + 1, Number(minutes), 0, 0)
				).toISOString(),
				timeZone: 'Asia/Kolkata'
			}
		});

		return json({ event: createdEvent, success: true });
	} catch (error) {
		console.error('Error creating calendar event:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
