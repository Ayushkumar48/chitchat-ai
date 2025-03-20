import { fail } from '@sveltejs/kit';
import { getChatByDate, createChat, addMessage, getMessages } from '$lib/server/chats';

export async function load({ locals }) {
	const userId = locals.user?.id;
	if (!userId) return fail(401, { error: 'Unauthorized' });

	const latestChat = await getChatByDate(userId, new Date());
	if (!latestChat) {
		const newChat = await createChat(userId);
		const newMessage = await addMessage({
			chatId: newChat.id,
			content: 'Hello, how can I help you today?',
			role: 'ai',
			userId: userId
		});
		return { latestChatMessages: newMessage };
	}
	const latestChatMessages = await getMessages(latestChat.id);
	if (!latestChatMessages) return { latestChatMessages: [] };
	return { latestChatMessages };
}
