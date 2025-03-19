<script lang="ts">
	import { CalendarIcon, MailIcon, MicIcon, ClockIcon } from '@lucide/svelte';
</script>

<section id="features" class="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
	<div class="px-4 md:px-6">
		<div class="flex flex-col items-center justify-center space-y-4 text-center">
			<div class="space-y-2">
				<h2 class="text-3xl font-bold tracking-tighter md:text-4xl/tight">
					Powerful Features for Effortless Scheduling
				</h2>
				<p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
					Our AI assistant makes booking appointments as simple as having a conversation.
				</p>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
			<div class="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
				<div class="rounded-full bg-primary/10 p-3">
					<MicIcon class="h-6 w-6 text-primary" />
				</div>
				<h3 class="text-xl font-bold">Voice Recognition</h3>
				<p class="text-center text-muted-foreground">
					Natural language processing understands your scheduling needs with high accuracy.
				</p>
			</div>
			<div class="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
				<div class="rounded-full bg-primary/10 p-3">
					<CalendarIcon class="h-6 w-6 text-primary" />
				</div>
				<h3 class="text-xl font-bold">Calendar Integration</h3>
				<p class="text-center text-muted-foreground">
					Appointments are automatically added to your preferred calendar application.
				</p>
			</div>
			<div class="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
				<div class="rounded-full bg-primary/10 p-3">
					<MailIcon class="h-6 w-6 text-primary" />
				</div>
				<h3 class="text-xl font-bold">Email Notifications</h3>
				<p class="text-center text-muted-foreground">
					Receive confirmation emails with all appointment details instantly.
				</p>
			</div>
			<div class="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
				<div class="rounded-full bg-primary/10 p-3">
					<ClockIcon class="h-6 w-6 text-primary" />
				</div>
				<h3 class="text-xl font-bold">24/7 Availability</h3>
				<p class="text-center text-muted-foreground">
					Book appointments anytime, day or night, without waiting for business hours.
				</p>
			</div>
		</div>
	</div>
</section>
