import { json } from '@sveltejs/kit';
import * as chatService from '$lib/server/chats';

export async function PUT({ request, locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const { chatId } = await request.json();
		if (!chatId) return json({ error: 'Chat ID is required' }, { status: 400 });

		const updatedChat = await chatService.updateChatLastUsed(chatId);
		return json({ success: true, chat: updatedChat });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to update chat last used' }, { status: 500 });
	}
}
