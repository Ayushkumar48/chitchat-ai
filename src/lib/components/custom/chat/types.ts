import type { Message, NewMessage } from '$lib/server/db/schema';

export type { Message, NewMessage };

export interface ChatState {
	messages: Message[];
	inputValue: string;
	isRecording: boolean;
	isTyping: boolean;
	failedMessage: string | null;
}

export interface ChatActions {
	handleSendMessage: () => Promise<void>;
	handleKeyDown: (e: KeyboardEvent) => void;
	toggleRecording: () => void;
}
