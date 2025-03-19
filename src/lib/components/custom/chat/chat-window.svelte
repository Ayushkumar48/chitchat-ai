<script lang="ts">
	import { page } from '$app/state';
	import type { Message, NewMessage } from '$lib/components/custom/chat/types';
	import { toast } from 'svelte-sonner';
	import MessageList from '$lib/components/custom/chat/message-list.svelte';
	import MessageInput from '$lib/components/custom/chat/message-input.svelte';
	import nlp from 'compromise';
	import datePlugin from 'compromise-dates';
	nlp.plugin(datePlugin);

	let messages = $state<Message[]>(
		page.data.latestChatMessages.map((message: Message) => {
			if (!message.id) {
				return { ...message, id: crypto.randomUUID() };
			}
			return message;
		})
	);

	let inputValue = $state('');
	let isRecording = $state(false);
	let isTyping = $state(false);
	let failedMessage = $state<string | null>(null);

	async function handleSendMessage() {
		if (!inputValue.trim()) return;

		const currentInput = inputValue;
		inputValue = '';
		isTyping = true;

		try {
			let chatId = messages[0]?.chatId;
			if (!chatId) {
				const response = await fetch('/api/chat/chats', {
					method: 'POST'
				});
				if (!response.ok) {
					throw new Error('Failed to create chat');
				}
				const data = await response.json();
				if (!data.success) {
					throw new Error(data.error || 'Failed to create chat');
				}
				chatId = data.chat[0].id;
			}

			const userMessage: NewMessage = {
				chatId,
				content: currentInput,
				role: 'user',
				userId: page.data.user?.id
			};

			const response = await fetch('/api/chat/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userMessage)
			});

			if (!response.ok) {
				throw new Error('Failed to send message');
			}

			const userMessageData = await response.json();
			if (!userMessageData.success) {
				throw new Error(userMessageData.error || 'Failed to send message');
			}

			messages.push({
				...userMessageData.message[0],
				createdAt: new Date(userMessageData.message[0].createdAt)
			});

			// Compromise NLP Integration
			const doc = nlp(currentInput);
			// @ts-expect-error
			const dates = doc.dates().format('MM/DD/YYYY').out('array');
			// @ts-expect-error
			const times = doc.times().out('array');
			const people = doc.people().out('array');
			const places = doc.places().out('array');
			console.log(dates, times, people, places);
			let aiResponse = 'Placeholder AI response.';

			if (dates.length > 0 || times.length > 0 || people.length > 0 || places.length > 0) {
				let detectedInfo = [];
				if (dates.length > 0) {
					detectedInfo.push('Dates: ' + dates.join(', '));
				}
				if (times.length > 0) {
					detectedInfo.push('Times: ' + times.join(', '));
				}
				if (people.length > 0) {
					detectedInfo.push('People: ' + people.join(', '));
				}
				if (places.length > 0) {
					detectedInfo.push('Places: ' + places.join(', '));
				}

				aiResponse = `I detected: ${detectedInfo.join(', ')}.`;
			}

			const aiMessage: NewMessage = {
				content: aiResponse,
				role: 'ai',
				chatId,
				userId: page.data.user?.id
			};

			const aiMessageResponse = await fetch('/api/chat/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(aiMessage)
			});

			if (!aiMessageResponse.ok) {
				throw new Error('Failed to save AI message');
			}

			const aiMessageData = await aiMessageResponse.json();
			if (!aiMessageData.success) {
				throw new Error(aiMessageData.error || 'Failed to save AI message');
			}

			messages.push({
				...aiMessageData.message[0],
				createdAt: new Date(aiMessageData.message[0].createdAt)
			});
		} catch (error) {
			console.error('Error sending message:', error);
			toast.error('Failed to send message. Please try again.');
			inputValue = currentInput;
			failedMessage = currentInput;
		} finally {
			isTyping = false;
		}
	}

	async function handleScheduleEvent() {
		try {
			const response = await fetch('/api/calendar/events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text: inputValue })
			});

			if (!response.ok) {
				throw new Error('Failed to schedule event');
			}

			const eventData = await response.json();
			if (!eventData.success) {
				throw new Error(eventData.error || 'Failed to schedule event');
			}

			const confirmationMessage = `Your event has been scheduled for ${eventData.event.start.dateTime} with ${eventData.event.attendees[0].email} at ${eventData.event.location}.`;
			messages.push({
				id: crypto.randomUUID(),
				chatId: messages[0]?.chatId || 'default',
				content: confirmationMessage,
				role: 'ai',
				createdAt: new Date(),
				userId: page.data.user?.id
			});
		} catch (error) {
			console.error('Error scheduling event:', error);
			toast.error('Failed to schedule event. Please try again.');
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	}
</script>

<div class="relative flex flex-col h-full">
	<MessageList bind:messages bind:isTyping />

	<MessageInput
		bind:inputValue
		bind:isRecording
		{handleSendMessage}
		{handleKeyDown}
		{handleScheduleEvent}
	/>
</div>
