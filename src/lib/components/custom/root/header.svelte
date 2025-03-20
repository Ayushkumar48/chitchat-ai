<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LogOut, MessageSquareIcon, User } from '@lucide/svelte';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	async function handleLogout() {
		const res = await fetch('/api/logout');
		if (res.ok) {
			toast.success('User logged out!');
			goto('/login', { replaceState: true });
			page.data.user = null;
		}
	}
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

		{#if page?.data?.user}
			<div class="flex items-center space-x-4">
				<Button size="sm" class="hidden md:flex" href="/chat/today">Chats</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<Avatar.Image src={page.data.user.image} alt={page.data.user.name} />
							<Avatar.Fallback class="rounded-lg"
								>{page.data.user.name
									.split(' ')
									.map((name: string) => name[0])
									.join('')}</Avatar.Fallback
							>
						</Avatar.Root>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-[var(--bits-dropdown-menu-anchor-width)] min-w-56 rounded-lg"
						align="end"
						sideOffset={4}
					>
						<DropdownMenu.Label class="p-0 font-normal">
							<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar.Root class="h-8 w-8 rounded-lg">
									<Avatar.Image src={page.data.user.image} alt={page.data.user.name} />
									<Avatar.Fallback class="rounded-lg">
										{page.data.user.name
											.split(' ')
											.map((name: string) => name[0])
											.join('')}
									</Avatar.Fallback>
								</Avatar.Root>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-semibold">{page.data.user.name}</span>
									<span class="truncate text-xs">{page.data.user.email}</span>
								</div>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<User />
								My Account
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item onclick={handleLogout}>
							<LogOut />
							Log out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{:else}
			<div class="flex items-center space-x-4">
				<Button variant="outline" size="sm" class="hidden md:flex" href="/login">Sign In</Button>
				<Button size="sm" href="/login">Get Started</Button>
			</div>
		{/if}
	</div>
</header>
