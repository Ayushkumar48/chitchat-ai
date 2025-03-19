import { json } from '@sveltejs/kit';
import * as chatService from '$lib/server/chats';

export async function GET({ locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const allChats = await chatService.getChats(userId);
		return json({ success: true, chats: allChats });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to get chats' }, { status: 500 });
	}
}

export async function POST({ locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const newChat = await chatService.createChat(userId);
		return json({ success: true, chat: newChat });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to create chat' }, { status: 500 });
	}
}

export async function DELETE({ request, locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const { chatId } = await request.json();
		if (!chatId) return json({ error: 'Chat ID is required' }, { status: 400 });

		const deletedChat = await chatService.deleteChat(chatId);
		return json({ success: true, chat: deletedChat });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to delete chat' }, { status: 500 });
	}
}
