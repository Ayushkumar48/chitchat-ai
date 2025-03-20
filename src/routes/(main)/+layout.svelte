<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import ChatHeader from '$lib/components/custom/chat/chat-header.svelte';
	import {
		allEventsDates,
		chatsDates,
		pastEventsDates,
		todaysEventsDates,
		upcomingEventsDates
	} from '$lib/store/store.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	let { children } = $props();
	onMount(() => {
		chatsDates.current = page.data.chatsDates;
		allEventsDates.current = page.data.allEventsDates;
		todaysEventsDates.current = page.data.todaysEventsDates;
		upcomingEventsDates.current = page.data.upcomingEventsDates;
		pastEventsDates.current = page.data.pastEventsDates;
	});
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="flex flex-col h-screen">
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm w-full justify-between"
		>
			<Sidebar.Trigger class="-ml-1" />
			<ChatHeader />
		</header>
		<Separator />

		<main class="flex-1 flex flex-col overflow-hidden">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
