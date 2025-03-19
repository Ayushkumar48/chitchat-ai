<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { fade, fly } from 'svelte/transition';
	import type { Message } from './types';
	import MessageItem from './message-item.svelte';
	import aiavatar from '$lib/public/ai-avatar.webp';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	let {
		messages = $bindable(),
		isTyping = $bindable()
	}: { messages: Message[]; isTyping: boolean } = $props();

	let messagesEnd: HTMLDivElement;

	$effect(() => {
		if (messagesEnd) {
			messagesEnd.scrollIntoView({ behavior: 'smooth' });
		}
	});
</script>

<div class="flex-1 h-full overflow-hidden">
	<ScrollArea class="h-full">
		<div class="space-y-6 max-w-3xl mx-auto px-4 py-6 pb-32">
			{#each messages as message (message.id)}
				<div in:fly={{ y: 20, duration: 300 }} out:fade>
					<MessageItem {message} />
				</div>
			{/each}

			{#if isTyping}
				<div in:fly={{ y: 20, duration: 300 }} out:fade class="flex items-start gap-3">
					<Avatar class="h-8 w-8">
						<AvatarImage src={aiavatar} />
						<AvatarFallback>AI</AvatarFallback>
					</Avatar>
					<div class="bg-muted rounded-2xl px-4 py-3">
						<div class="flex space-x-1.5">
							<div
								class="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
								style="animation-delay: 0ms"
							></div>
							<div
								class="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
								style="animation-delay: 150ms"
							></div>
							<div
								class="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
								style="animation-delay: 300ms"
							></div>
						</div>
					</div>
				</div>
			{/if}

			<div bind:this={messagesEnd}></div>
		</div>
	</ScrollArea>
</div>
