<script lang="ts">
	import Image2 from '$lib/assets/2.png';
	import { Button } from '$lib/components/ui/button';
	import { MicIcon } from '@lucide/svelte';
</script>

<section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
	<div class="px-4 md:px-12">
		<div class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h1 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
						Book Appointments with AI Voice Assistant
					</h1>
					<p class="max-w-[600px] text-muted-foreground md:text-xl">
						Simply speak to our AI assistant to schedule appointments, receive email confirmations,
						and add events to your calendar.
					</p>
				</div>
				<div class="flex flex-col gap-2 min-[400px]:flex-row">
					<Button size="lg" class="h-12 px-8">
						<MicIcon class="mr-2 h-5 w-5" />
						Start Talking
					</Button>
					<Button variant="outline" size="lg" class="h-12 px-8">Learn More</Button>
				</div>
			</div>
			<div class="flex items-center justify-center">
				<div
					class="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
				>
					<img
						src={Image2}
						alt="AI Assistant"
						class="object-contain ring-[0.1px] ring-gray-200 rounded-lg"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
