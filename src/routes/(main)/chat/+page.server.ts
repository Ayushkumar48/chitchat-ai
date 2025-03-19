import { fail } from '@sveltejs/kit';
import * as chatService from '$lib/server/chats';
import type { Message } from '$lib/server/db/schema';

export async function load({ locals }) {
	const userId = locals.user?.id;
	if (!userId) return fail(401, { error: 'Unauthorized' });

	const latestChat = await chatService.getLastChat(userId);
	if (!latestChat) {
		const [newChat] = await chatService.createChat(userId);
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

export const actions = {
	getMessages: async ({ request }) => {
		const { chatId } = await request.json();
		if (!chatId) return fail(400, { error: 'Chat ID is required' });

		try {
			const messages = await chatService.getMessages(chatId);
			return { success: true, messages };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to get messages' });
		}
	},

	addMessage: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { error: 'Unauthorized' });

		try {
			const formData = await request.formData();
			const messageData = JSON.parse(formData.get('message') as string);
			const message: Message = {
				...messageData,
				userId
			};
			const newMessage = await chatService.addMessage(message);
			return { success: true, message: newMessage };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to add message' });
		}
	},

	createChat: async ({ locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { error: 'Unauthorized' });

		try {
			const newChat = await chatService.createChat(userId);
			return { success: true, chat: newChat };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to create chat' });
		}
	},

	getChats: async ({ locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { error: 'Unauthorized' });

		try {
			const allChats = await chatService.getChats(userId);
			return { success: true, chats: allChats };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to get chats' });
		}
	},

	getLastChat: async ({ locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { error: 'Unauthorized' });

		try {
			const chat = await chatService.getLastChat(userId);
			return { success: true, chat };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to get last chat' });
		}
	},

	deleteChat: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { error: 'Unauthorized' });

		try {
			const { chatId } = await request.json();
			if (!chatId) return fail(400, { error: 'Chat ID is required' });

			const deletedChat = await chatService.deleteChat(chatId);
			return { success: true, chat: deletedChat };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to delete chat' });
		}
	},

	deleteAllChats: async ({ locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { error: 'Unauthorized' });

		try {
			const deletedChats = await chatService.deleteAllChats(userId);
			return { success: true, chats: deletedChats };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to delete all chats' });
		}
	},

	updateChatLastUsed: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { error: 'Unauthorized' });

		try {
			const { chatId } = await request.json();
			if (!chatId) return fail(400, { error: 'Chat ID is required' });

			const updatedChat = await chatService.updateChatLastUsed(chatId);
			return { success: true, chat: updatedChat };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to update chat last used' });
		}
	}
};
