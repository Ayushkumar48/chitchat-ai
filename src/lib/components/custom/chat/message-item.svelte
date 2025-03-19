<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { cn } from '$lib/utils';
	import type { Message } from './types';
	import { page } from '$app/state';
	import aiavatar from '$lib/public/ai-avatar.webp';

	let { message }: { message: Message } = $props();
</script>

<div class={cn('flex items-start gap-3 mb-4', message.role === 'user' && 'flex-row-reverse')}>
	{#if message.role === 'ai'}
		<Avatar class="h-8 w-8">
			<AvatarImage src={aiavatar} />
			<AvatarFallback>AI</AvatarFallback>
		</Avatar>
	{/if}

	<div
		class={cn(
			'rounded-2xl px-4 py-3 max-w-[85%]',
			message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
		)}
	>
		<p class="text-sm leading-relaxed">{message.content}</p>
		<p class="text-xs opacity-70 mt-1.5">
			{message.createdAt.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			})}
		</p>
	</div>

	{#if message.role === 'user'}
		<Avatar class="h-8 w-8">
			<AvatarImage src={page.data.user?.image} />
			<AvatarFallback
				>{page.data.user?.name
					?.split(' ')
					.map((i: string) => i[0])
					.join('') || 'Me'}</AvatarFallback
			>
		</Avatar>
	{/if}
</div>
