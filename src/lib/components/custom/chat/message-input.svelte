<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { MicIcon, SendIcon, CalendarIcon, PaperclipIcon, SmileIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import type { ChatActions } from './types';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let {
		inputValue = $bindable(),
		isRecording = $bindable(),
		isDisabled = $bindable(),
		handleKeyDown,
		handleSendMessage
	}: {
		inputValue: string;
		isRecording: boolean;
		isDisabled: boolean;
		handleSendMessage: ChatActions['handleSendMessage'];
		handleKeyDown: ChatActions['handleKeyDown'];
	} = $props();

	let recognition: SpeechRecognition | null = null;

	onMount(() => {
		if (
			typeof window !== 'undefined' &&
			('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
		) {
			const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
			recognition = new SpeechRecognitionAPI();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = 'en-US';

			recognition.onresult = (event) => {
				const transcript = Array.from(event.results)
					.map((result) => result[0].transcript)
					.join('');
				inputValue = transcript;
			};

			recognition.onerror = (event) => {
				console.error('Speech recognition error:', event.error);
				toast.error('Speech recognition error');
			};
		}
	});

	function toggleRecording() {
		if (!recognition) return;

		if (isRecording) {
			recognition.stop();
		} else {
			recognition.start();
		}
		isRecording = !isRecording;
	}
</script>

<div class="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm z-10">
	<div class="max-w-3xl mx-auto p-4 pb-6">
		<div class="relative flex items-center">
			<Button variant="ghost" size="icon" class="absolute left-2 hover:bg-primary/10" type="button">
				<PaperclipIcon class="h-5 w-5" />
			</Button>

			<Input
				bind:value={inputValue}
				onkeydown={handleKeyDown}
				placeholder={isRecording ? 'Listening...' : 'Type your message...'}
				class={cn(
					'pl-10 pr-24 py-6 rounded-full border-2 transition-all duration-200',
					isRecording
						? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
						: 'border-border/50 focus:border-primary/50'
				)}
			/>

			<div class="absolute right-2 flex items-center space-x-1">
				<Button variant="ghost" size="icon" type="button" class="hover:bg-primary/10">
					<SmileIcon class="h-5 w-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					type="button"
					onclick={toggleRecording}
					class={cn(
						'hover:bg-primary/10 transition-colors duration-200',
						isRecording && 'text-red-500 hover:text-red-600'
					)}
				>
					<MicIcon class="h-5 w-5" />
				</Button>

				<Button
					size="icon"
					type="button"
					onclick={handleSendMessage}
					disabled={!inputValue.trim() || isDisabled}
					class="bg-primary hover:bg-primary/90 transition-colors duration-200 rounded-full"
				>
					<SendIcon class="h-5 w-5" />
				</Button>
			</div>
		</div>

		<div class="flex justify-center mt-4">
			<Button
				variant="outline"
				class="rounded-full hover:bg-primary/10 transition-colors duration-200"
			>
				<CalendarIcon class="h-4 w-4 mr-2" />
				Schedule Appointment
			</Button>
		</div>
	</div>
</div>
