<script lang="ts">
	import image1 from '$lib/assets/1.png';
	import image3 from '$lib/assets/3.png';
	import image4 from '$lib/assets/4.png';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Card, CardContent } from '$lib/components/ui/card';
	let workingData = [
		{
			id: 1,

			heading: 'Click the Microphone',
			description: 'Tap the microphone button to activate the AI assistant.',
			image: image1
		},
		{
			id: 2,
			heading: 'Speak Your Request',
			description: "Tell the AI when you'd like to schedule your appointment.",
			image: image3
		},
		{
			id: 3,
			heading: 'Confirm and Receive',
			description: 'Confirm the details and receive email confirmation with calendar event.',
			image: image4
		}
	];
</script>

<section id="how-it-works" class="w-full py-12 md:py-24 lg:py-32">
	<div class="px-4 md:px-6">
		<div class="flex flex-col items-center justify-center space-y-4 text-center">
			<div class="space-y-2">
				<h2 class="text-3xl font-bold tracking-tighter md:text-4xl/tight">How ChitChat AI Works</h2>
				<p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
					Three simple steps to schedule your appointments with voice commands.
				</p>
			</div>
		</div>
		<div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
			{#each workingData as item}
				<Card>
					<CardContent class="flex flex-col items-center pt-6">
						<div
							class="mb-4 rounded-full bg-primary/10 p-2 text-primary w-10 h-10 flex items-center justify-center"
						>
							<span class="text-2xl font-bold">{item.id}</span>
						</div>
						<Dialog.Root>
							<Dialog.Trigger>
								<img
									src={item.image}
									alt={item.heading}
									width="200"
									height="200"
									class="rounded-lg object-cover mb-4"
								/>
							</Dialog.Trigger>
							<Dialog.Content class="h-[30rem] w-auto">
								<img
									src={item.image}
									alt={item.heading}
									class="rounded-lg object-cover mb-4 h-full w-full"
								/>
							</Dialog.Content>
						</Dialog.Root>

						<h3 class="text-xl font-bold mb-2">{item.heading}</h3>
						<p class="text-center text-muted-foreground">
							{item.description}
						</p>
					</CardContent>
				</Card>
			{/each}
		</div>
		<p class="text-center mt-8">Don't worry about forgetting appointments</p>
	</div>
</section>
