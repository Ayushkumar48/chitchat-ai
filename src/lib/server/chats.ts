import { db } from './db';
import { chats, events, messages, type NewEvent, type NewMessage } from './db/schema';
import { desc, eq, and, sql, between, gte, lt, asc } from 'drizzle-orm';

export async function getMessages(chatId: string) {
	try {
		const allMessages = await db
			.select()
			.from(messages)
			.where(eq(messages.chatId, chatId))
			.orderBy(asc(messages.createdAt));
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
		const [newChat] = await db.insert(chats).values({ userId }).returning();
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
			.orderBy(desc(chats.createdAt));
		return allChats;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get chats');
	}
}

export async function getChatsDates(userId: string) {
	try {
		const allChats = await db
			.select({
				id: chats.id,
				date: chats.createdAt
			})
			.from(chats)
			.where(eq(chats.userId, userId))
			.orderBy(desc(chats.createdAt));
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

export async function getChatByDate(userId: string, date: Date) {
	try {
		const targetDate = date.toISOString().split('T')[0];
		const [chat] = await db
			.select()
			.from(chats)
			.where(and(eq(chats.userId, userId), sql`DATE(${chats.createdAt}) = ${targetDate}`));
		return chat;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get chat by date');
	}
}

export async function addEvent(event: NewEvent) {
	try {
		const newEvent = await db
			.insert(events)
			.values({ ...event, date: new Date(event.date) })
			.returning();
		return newEvent;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to add event');
	}
}

export async function getAllEvents(userId: string) {
	try {
		const allEvents = await db.select().from(events).where(eq(events.userId, userId));
		return allEvents;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get all events');
	}
}

export async function getAllEventsDates(userId: string) {
	try {
		const allEventsDates = await db
			.select({ id: events.id, date: events.date })
			.from(events)
			.where(eq(events.userId, userId));
		return allEventsDates;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get all events dates');
	}
}

export async function getTodaysEvents(userId: string) {
	try {
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));
		const todaysEvents = await db
			.select()
			.from(events)
			.where(and(eq(events.userId, userId), between(events.date, startOfDay, endOfDay)));
		return todaysEvents;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to get today's events");
	}
}

export async function getTodaysEventsDates(userId: string) {
	try {
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));
		const todaysEvents = await db
			.select({ id: events.id, date: events.date })
			.from(events)
			.where(and(eq(events.userId, userId), between(events.date, startOfDay, endOfDay)));
		return todaysEvents;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to get today's events");
	}
}

export async function getUpcomingEvents(userId: string) {
	try {
		const upcomingEvents = await db
			.select()
			.from(events)
			.where(and(eq(events.userId, userId), gte(events.date, new Date())));
		return upcomingEvents;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get upcoming events');
	}
}
export async function getUpcomingEventsDates(userId: string) {
	try {
		const upcomingEvents = await db
			.select({ id: events.id, date: events.date })
			.from(events)
			.where(and(eq(events.userId, userId), gte(events.date, new Date())));
		return upcomingEvents;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get upcoming events');
	}
}

export async function pastEvents(userId: string) {
	try {
		const pastEvents = await db
			.select()
			.from(events)
			.where(and(eq(events.userId, userId), lt(events.date, new Date())));
		return pastEvents;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get past events');
	}
}
export async function getPastEventsDates(userId: string) {
	try {
		const pastEvents = await db
			.select({ id: events.id, date: events.date })
			.from(events)
			.where(and(eq(events.userId, userId), lt(events.date, new Date())));
		return pastEvents;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to get past events');
	}
}
