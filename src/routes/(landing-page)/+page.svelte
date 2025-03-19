<script lang="ts">
	import Header from '$lib/components/custom/root/header.svelte';
	import Hero from '$lib/components/custom/root/hero.svelte';
	import Features from '$lib/components/custom/root/features.svelte';
	import HowItWorks from '$lib/components/custom/root/how-it-works.svelte';
	import DemoSection from '$lib/components/custom/root/demo-section.svelte';
	import Footer from '$lib/components/custom/root/footer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { MicIcon } from '@lucide/svelte';
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		<Hero />
		<Features />
		<HowItWorks />
		<DemoSection />
		<section class="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
			<div class="px-4 md:px-6">
				<div class="flex flex-col items-center justify-center space-y-4 text-center">
					<div class="space-y-2">
						<h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Ready to streamline your appointments?
						</h2>
						<p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
							Start using ChitChat AI today and experience the future of appointment booking.
						</p>
					</div>
					<div class="space-x-4">
						<Button size="lg" class="h-12 px-8">
							<MicIcon class="mr-2 h-5 w-5" />
							Try ChitChat AI Now
						</Button>
					</div>
				</div>
			</div>
		</section>
	</main>
	<Footer />
</div>
