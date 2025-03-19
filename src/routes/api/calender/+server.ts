import { json, type RequestHandler } from '@sveltejs/kit';
import { google } from 'googleapis';
import { getGoogleAccount } from '$lib/server/auth';

interface EventData {
	summary: string;
	location?: string;
	description?: string;
	start: {
		dateTime: string;
		timeZone: string;
	};
	end: {
		dateTime: string;
		timeZone: string;
	};
}

const createCalendarEvent = async (accessToken: string, event: EventData) => {
	const calendar = google.calendar({ version: 'v3', auth: accessToken });

	try {
		const response = await calendar.events.insert({
			calendarId: 'primary',
			requestBody: event,
			sendUpdates: 'all'
		});

		console.log('Event created:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error creating event:', error);
		throw error;
	}
};

const createGoogleCalendarEvent = async (userId: string, eventData: EventData) => {
	const googleAccount = await getGoogleAccount(userId);

	if (!googleAccount) {
		throw new Error('No linked Google account found.');
	}

	return await createCalendarEvent(googleAccount.accessToken, eventData);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const userId = locals.session.userId;

		const eventData = (await request.json()) as EventData;

		if (!eventData) {
			return json({ error: 'Event data is required' }, { status: 400 });
		}

		const createdEvent = await createGoogleCalendarEvent(userId, eventData);

		return json({ event: createdEvent });
	} catch (error) {
		console.error('Error creating calendar event:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
