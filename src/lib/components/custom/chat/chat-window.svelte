<script lang="ts">
	import { page } from '$app/state';
	import type { Message, NewMessage, DetectedData } from '$lib/components/custom/chat/types';
	import { toast } from 'svelte-sonner';
	import MessageList from '$lib/components/custom/chat/message-list.svelte';
	import MessageInput from '$lib/components/custom/chat/message-input.svelte';
	import nlp from 'compromise';
	import datePlugin from 'compromise-dates';
	import { convertTo12HourFormat } from '$lib';
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
	let isDisabled = $state(false);

	async function handleSendMessage() {
		if (!inputValue.trim() || isDisabled) return;
		isDisabled = true;
		const currentInput = inputValue;
		inputValue = '';
		isTyping = true;

		try {
			let chatId = messages[0]?.chatId;

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
				toast.error('Failed to send message');
				return;
			}

			const userMessageData = await response.json();
			if (!userMessageData.success) {
				toast.error(userMessageData.error || 'Failed to send message');
				return;
			}

			const doc = nlp(currentInput);
			// @ts-expect-error
			const date = doc.dates().json()[0]?.dates?.start;
			// @ts-expect-error
			const time = doc.times().json()[0]?.time?.['24h'] || '00:00';
			const people = doc.people().out('array');
			const places = doc.places().out('array');
			const detectedData = {
				date,
				time,
				people,
				places
			};
			let aiResponse = 'Failed to add event';
			if (!date) {
				inputValue = currentInput;
				toast.error('No date detected');
				return;
			}
			messages.push({
				...userMessageData.message[0],
				createdAt: new Date(userMessageData.message[0].createdAt)
			});

			if (date || time || people.length > 0 || places.length > 0) {
				let detectedInfo = [];
				if (date) {
					detectedInfo.push(
						'Date: ' +
							new Date(date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric'
							})
					);
				}
				if (time) {
					detectedInfo.push('Time: ' + time);
				}
				if (people.length > 0) {
					detectedInfo.push('People: ' + people.join(', '));
				}
				if (places.length > 0) {
					detectedInfo.push('Places: ' + places.join(', '));
				}
			}
			const isScheduled = await handleScheduleEvent(detectedData);
			if (isScheduled) {
				const scheduledMessage = `Event scheduled for ${new Date(
					detectedData.date
				).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}${detectedData.time ? ` at ${convertTo12HourFormat(detectedData.time)}` : ''}${detectedData.people ? ` with ${detectedData.people.join(', ')}` : ''}${detectedData.places ? ` at ${detectedData.places.join(', ')}` : ''}.`;
				aiResponse = scheduledMessage;
				toast.success(scheduledMessage);
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
				toast.error('Failed to save AI message');
				return;
			}

			const aiMessageData = await aiMessageResponse.json();
			if (!aiMessageData.success) {
				toast.error(aiMessageData.error || 'Failed to save AI message');
				return;
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
			isDisabled = false;
		}
	}

	async function handleScheduleEvent(detectedData: DetectedData) {
		try {
			const response = await fetch('/api/calendar', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(detectedData)
			});

			if (!response.ok) {
				toast.error('Failed to schedule event');
				return false;
			}

			const eventData = await response.json();
			if (!eventData.success) {
				toast.error(eventData.error || 'Failed to schedule event');
				return false;
			}

			return true;
		} catch (error) {
			console.error('Error scheduling event:', error);
			toast.error('Failed to schedule event. Please try again.');
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			if (inputValue.trim() && !isDisabled) {
				e.preventDefault();
				handleSendMessage();
			}
		}
	}
</script>

<div class="relative flex flex-col h-full">
	<MessageList bind:messages bind:isTyping />

	<MessageInput
		bind:inputValue
		bind:isRecording
		bind:isDisabled
		{handleSendMessage}
		{handleKeyDown}
	/>
</div>
