import { json } from '@sveltejs/kit';
import * as chatService from '$lib/server/chats';
import type { Message } from '$lib/server/db/schema';

export async function POST({ request, locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const messageData = await request.json();
		const message: Message = {
			...messageData,
			userId
		};
		const newMessage = await chatService.addMessage(message);
		return json({ success: true, message: newMessage });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to add message' }, { status: 500 });
	}
}

export async function GET({ request, locals }) {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const { searchParams } = new URL(request.url);
		const chatId = searchParams.get('chatId');

		if (!chatId) return json({ error: 'Chat ID is required' }, { status: 400 });

		const messages = await chatService.getMessages(chatId);
		return json({ success: true, messages });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to get messages' }, { status: 500 });
	}
}
