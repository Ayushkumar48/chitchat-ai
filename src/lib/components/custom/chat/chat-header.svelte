<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { HomeIcon, SettingsIcon, LogOutIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	async function handleLogout() {
		const res = await fetch('/api/logout');
		if (res.ok) {
			toast.success('User logged out!');
			goto('/login');
		}
	}
</script>

<div class="flex items-center gap-2">
	<Button variant="ghost" size="icon" onclick={() => goto('/')}>
		<HomeIcon class="h-5 w-5" />
	</Button>
	<Button variant="ghost" size="icon" href="#top">
		<SettingsIcon class="h-5 w-5" />
	</Button>
	<Button variant="ghost" size="icon" onclick={handleLogout}>
		<LogOutIcon class="h-5 w-5" />
	</Button>
</div>
