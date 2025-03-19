import { db } from './db';
import { chats, messages, type NewMessage } from './db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getMessages(chatId: string) {
	try {
		const allMessages = await db.select().from(messages).where(eq(messages.chatId, chatId));
		return allMessages;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get messages');
	}
}

export async function addMessage(message: NewMessage) {
	try {
		const newMessage = await db.insert(messages).values(message).returning();
		return newMessage;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to add message');
	}
}

export async function createChat(userId: string) {
	try {
		const newChat = await db.insert(chats).values({ userId }).returning();
		return newChat;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to create chat');
	}
}

export async function getChats(userId: string) {
	try {
		const allChats = await db
			.select()
			.from(chats)
			.where(eq(chats.userId, userId))
			.orderBy(desc(chats.lastUsed));
		return allChats;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get chats');
	}
}

export async function getLastChat(userId: string) {
	try {
		const [chat] = await db
			.select()
			.from(chats)
			.where(eq(chats.userId, userId))
			.orderBy(desc(chats.lastUsed))
			.limit(1);
		return chat;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get last chat');
	}
}

export async function deleteChat(chatId: string) {
	try {
		const deletedChat = await db.delete(chats).where(eq(chats.id, chatId));
		return deletedChat;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to delete chat');
	}
}

export async function deleteAllChats(userId: string) {
	try {
		const deletedChats = await db.delete(chats).where(eq(chats.userId, userId));
		return deletedChats;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to delete all chats');
	}
}

export async function updateChatLastUsed(chatId: string) {
	try {
		const updatedChat = await db
			.update(chats)
			.set({ lastUsed: new Date() })
			.where(eq(chats.id, chatId))
			.returning();
		return updatedChat;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to update chat last used');
	}
}
