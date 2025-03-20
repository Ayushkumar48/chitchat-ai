import {
	getAllEventsDates,
	getUpcomingEventsDates,
	getTodaysEventsDates,
	getPastEventsDates,
	getChatsDates
} from '$lib/server/chats';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user && !locals.session) {
		redirect(302, '/login');
	}
	const chatsDates = await getChatsDates(locals.user?.id as string);
	const allEventsDates = await getAllEventsDates(locals.user?.id as string);
	const todaysEventsDates = await getTodaysEventsDates(locals.user?.id as string);
	const upcomingEventsDates = await getUpcomingEventsDates(locals.user?.id as string);
	const pastEventsDates = await getPastEventsDates(locals.user?.id as string);
	return {
		user: locals.user,
		chatsDates,
		allEventsDates,
		todaysEventsDates,
		upcomingEventsDates,
		pastEventsDates
	};
}
