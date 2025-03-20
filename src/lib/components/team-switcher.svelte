<script lang="ts">
	import { Menu, MenuButton, MenuItem } from '$lib/components/ui/sidebar/index.js';
	import { MessageSquareIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
</script>

<Menu>
	<MenuItem>
		<MenuButton
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			onclick={() => goto('/')}
		>
			<div
				class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
			>
				<MessageSquareIcon class="size-4 text-primary" />
			</div>
			<div class="grid flex-1 text-left text-sm leading-tight">
				<span class="truncate font-semibold"> ChitChat AI </span>
				<span class="truncate text-xs">Events</span>
			</div>
		</MenuButton>
	</MenuItem>
</Menu>
