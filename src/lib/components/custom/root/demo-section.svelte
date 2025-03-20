<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { MicIcon, StopCircleIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';

	let isListening = false;
	let conversation = [
		{
			type: 'ai',
			text: "Hello! I'm ChitChat AI. How can I help you schedule an appointment today?"
		}
	];

	function toggleListening() {
		if (!isListening) {
			isListening = true;
			setTimeout(() => {
				addMessage('user', 'I need to schedule a dentist appointment for next Tuesday at 2pm.');
				setTimeout(() => {
					addMessage(
						'ai',
						'I can help you schedule that. To confirm, you want a dentist appointment for Tuesday, March 24th at 2:00 PM. Is that correct?'
					);
					setTimeout(() => {
						addMessage('user', "Yes, that's correct.");
						setTimeout(() => {
							addMessage(
								'ai',
								"Great! I've scheduled your dentist appointment for Tuesday, March 24th at 2:00 PM. You'll receive a confirmation email shortly, and I've added this to your calendar. Is there anything else you need help with?"
							);
							isListening = false;
						}, 2000);
					}, 2000);
				}, 1500);
			}, 2000);
		} else {
			isListening = false;
		}
	}

	function addMessage(type: 'user' | 'ai', text: string) {
		conversation = [...conversation, { type, text }];
	}
</script>

<section id="demo" class="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
	<div class="container px-4 md:px-6">
		<div class="flex flex-col items-center justify-center space-y-4 text-center">
			<div class="space-y-2">
				<h2 class="text-3xl font-bold tracking-tighter md:text-4xl/tight">
					See ChitChat AI in Action
				</h2>
				<p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
					Try our interactive demo to experience how easy it is to book appointments with voice
					commands.
				</p>
			</div>
		</div>

		<div class="mx-auto max-w-3xl mt-12">
			<Card class="border-2">
				<CardContent class="p-6">
					<div class="flex flex-col space-y-4 mb-4 max-h-[400px] overflow-y-auto">
						{#each conversation as message, index}
							<div class={cn('flex', message.type === 'user' ? 'justify-end' : 'justify-start')}>
								<div
									class={cn(
										'max-w-[80%] rounded-lg px-4 py-2',
										message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
									)}
								>
									{message.text}
								</div>
							</div>
						{/each}
					</div>

					<div class="flex justify-center">
						<Button
							size="lg"
							class={cn('h-16 w-16 rounded-full', isListening && 'bg-red-500 hover:bg-red-600')}
							onclick={toggleListening}
						>
							{#if isListening}
								<StopCircleIcon class="h-8 w-8" />
							{:else}
								<MicIcon class="h-8 w-8" />
							{/if}
						</Button>
					</div>

					<p class="text-center text-sm text-muted-foreground mt-4">
						{isListening ? 'Listening... Click to stop' : 'Click the microphone to start speaking'}
					</p>

					<div class="flex justify-center mt-8">
						<Button size="lg" onclick={() => goto('/chat/today')}>Try the Full Experience</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</section>
