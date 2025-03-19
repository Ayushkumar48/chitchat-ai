<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { HomeIcon, SettingsIcon, LogOutIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
</script>

<div class="flex items-center gap-2">
	<Button variant="ghost" size="icon" onclick={() => goto('/')}>
		<HomeIcon class="h-5 w-5" />
	</Button>
	<Button variant="ghost" size="icon" onclick={() => goto('/settings')}>
		<SettingsIcon class="h-5 w-5" />
	</Button>
	<Button variant="ghost" size="icon" onclick={() => goto('/login')}>
		<LogOutIcon class="h-5 w-5" />
	</Button>
</div>
