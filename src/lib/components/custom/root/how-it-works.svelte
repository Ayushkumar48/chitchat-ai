<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
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
			<Card>
				<CardContent class="flex flex-col items-center pt-6">
					<div
						class="mb-4 rounded-full bg-primary/10 p-2 text-primary w-10 h-10 flex items-center justify-center"
					>
						<span class="text-2xl font-bold">1</span>
					</div>
					<img
						src="/placeholder.svg?height=200&width=200"
						alt="Click the microphone"
						width="200"
						height="200"
						class="rounded-lg object-cover mb-4"
					/>
					<h3 class="text-xl font-bold mb-2">Click the Microphone</h3>
					<p class="text-center text-muted-foreground">
						Tap the microphone button to activate the AI assistant.
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="flex flex-col items-center pt-6">
					<div
						class="mb-4 rounded-full bg-primary/10 p-2 text-primary w-10 h-10 flex items-center justify-center"
					>
						<span class="text-2xl font-bold">2</span>
					</div>
					<img
						src="/placeholder.svg?height=200&width=200"
						alt="Speak your request"
						width="200"
						height="200"
						class="rounded-lg object-cover mb-4"
					/>
					<h3 class="text-xl font-bold mb-2">Speak Your Request</h3>
					<p class="text-center text-muted-foreground">
						Tell the AI when you'd like to schedule your appointment.
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="flex flex-col items-center pt-6">
					<div
						class="mb-4 rounded-full bg-primary/10 p-2 text-primary w-10 h-10 flex items-center justify-center"
					>
						<span class="text-2xl font-bold">3</span>
					</div>
					<img
						src="/placeholder.svg?height=200&width=200"
						alt="Confirm and receive"
						width="200"
						height="200"
						class="rounded-lg object-cover mb-4"
					/>
					<h3 class="text-xl font-bold mb-2">Confirm and Receive</h3>
					<p class="text-center text-muted-foreground">
						Confirm the details and receive email confirmation with calendar event.
					</p>
				</CardContent>
			</Card>
		</div>
		<p class="text-center mt-8">Don't worry about forgetting appointments</p>
	</div>
</section>
