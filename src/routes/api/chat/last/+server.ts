import { json } from '@sveltejs/kit';
import * as chatService from '$lib/server/chats';

export async function GET({ locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const chat = await chatService.getLastChat(userId);
		return json({ success: true, chat });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to get last chat' }, { status: 500 });
	}
}

export async function DELETE({ locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const deletedChats = await chatService.deleteAllChats(userId);
		return json({ success: true, chats: deletedChats });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to delete all chats' }, { status: 500 });
	}
}
