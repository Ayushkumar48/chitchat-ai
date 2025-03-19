<script lang="ts">
	import { MessageSquareIcon } from '@lucide/svelte';
</script>

<footer class="w-full py-6 px-4 md:px-6 border-t">
	<div class="flex flex-col md:flex-row items-center justify-between gap-4">
		<div class="flex items-center space-x-2">
			<MessageSquareIcon class="h-5 w-5 text-primary" />
			<span class="text-lg font-semibold">ChitChat AI</span>
		</div>
		<nav class="flex items-center space-x-4 text-sm">
			<a href="#top" class="text-muted-foreground hover:text-foreground"> Privacy </a>
			<a href="#top" class="text-muted-foreground hover:text-foreground"> Terms </a>
			<a href="#top" class="text-muted-foreground hover:text-foreground"> Contact </a>
		</nav>
		<div class="text-sm text-muted-foreground">
			&copy; {new Date().getFullYear()} ChitChat AI. All rights reserved.
		</div>
	</div>
</footer>
