<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import {
		BotMessageSquare,
		Calendar,
		Calendar1,
		CalendarArrowDown,
		CalendarArrowUp,
		ChevronRight
	} from '@lucide/svelte';
	import {
		chatsDates,
		todaysEventsDates,
		upcomingEventsDates,
		pastEventsDates,
		allEventsDates
	} from '$lib/store/store.svelte';
	const items = $derived([
		{
			title: 'Chats',
			url: '#',
			icon: BotMessageSquare,
			isActive: true,
			items: chatsDates.current.map((chat) => ({
				title: new Date(chat).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				}),
				url: `/chat/${chat}`
			}))
		},
		{
			title: "Today's Events",
			url: '#',
			icon: Calendar1,
			isActive: false,
			items: todaysEventsDates.current.map((event) => ({
				title: new Date(event).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				}),
				url: `/events/${event}`
			}))
		},
		{
			title: 'Upcoming Events',
			url: '#',
			icon: CalendarArrowUp,
			isActive: false,
			items: upcomingEventsDates.current.map((event) => ({
				title: new Date(event).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				}),
				url: `/events/${event}`
			}))
		},
		{
			title: 'Past Events',
			url: '#',
			icon: CalendarArrowDown,
			isActive: false,
			items: pastEventsDates.current.map((event) => ({
				title: new Date(event).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				}),
				url: `/events/${event}`
			}))
		},
		{
			title: 'All Events',
			url: '#',
			icon: Calendar,
			isActive: false,
			items: allEventsDates.current.map((event) => ({
				title: new Date(event).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				}),
				url: `/events/${event}`
			}))
		}
	]);
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Chats</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton {...props}>
									{#snippet tooltipContent()}
										{mainItem.title}
									{/snippet}
									{#if mainItem.icon}
										<mainItem.icon />
									{/if}
									<span>{mainItem.title}</span>
									<ChevronRight
										class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									/>
								</Sidebar.MenuButton>
							{/snippet}
						</Collapsible.Trigger>
						<Collapsible.Content>
							{#if mainItem?.items?.length > 0}
								<Sidebar.MenuSub>
									{#each mainItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{:else}
								<Sidebar.MenuSub>
									<Sidebar.MenuSubItem class="text-sm italic text-gray-400"
										>No Events to show</Sidebar.MenuSubItem
									>
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
