import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.session && locals.user) {
		redirect(308, '/chat');
	}
}
