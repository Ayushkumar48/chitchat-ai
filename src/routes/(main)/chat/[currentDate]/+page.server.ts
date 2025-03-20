import { fail } from '@sveltejs/kit';
import * as chatService from '$lib/server/chats';

export async function load({ locals, params }) {
	const currentDate = new Date(params.currentDate);
	if (isNaN(currentDate.getTime())) return fail(400, { error: 'Invalid date' });
	const userId = locals.user?.id;
	if (!userId) return fail(401, { error: 'Unauthorized' });

	const latestChat = await chatService.getChatByDate(userId, currentDate);
	if (!latestChat) {
		const newChat = await chatService.createChat(userId);
		const newMessage = await chatService.addMessage({
			chatId: newChat.id,
			content: 'Hello, how can I help you today?',
			role: 'ai',
			userId: userId
		});
		return { latestChatMessages: newMessage };
	}
	const latestChatMessages = await chatService.getMessages(latestChat.id);
	if (!latestChatMessages) return { latestChatMessages: [] };
	return { latestChatMessages };
}
