<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { MessageSquareIcon } from '@lucide/svelte';
</script>

<header class="w-full py-4 px-4 md:px-6 border-b">
	<div class="flex items-center justify-between">
		<a href="/" class="flex items-center space-x-2">
			<MessageSquareIcon class="h-6 w-6 text-primary" />
			<span class="text-xl font-bold">ChitChat AI</span>
		</a>
		<nav class="hidden md:flex items-center space-x-6">
			<a href="#features" class="text-sm font-medium hover:text-primary"> Features </a>
			<a href="#how-it-works" class="text-sm font-medium hover:text-primary"> How It Works </a>
			<a href="#demo" class="text-sm font-medium hover:text-primary"> Demo </a>
		</nav>
		<div class="flex items-center space-x-4">
			<Button variant="outline" size="sm" class="hidden md:flex" href="/login">Sign In</Button>
			<Button size="sm" href="/login">Get Started</Button>
		</div>
	</div>
</header>
