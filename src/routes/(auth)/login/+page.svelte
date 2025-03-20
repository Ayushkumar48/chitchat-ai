<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { goto } from '$app/navigation';
</script>

<div
	class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div
		class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden"
	>
		<div
			class="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		></div>
		<div class="relative z-10 mt-auto">
			<h3 class="text-xl font-medium">Welcome back</h3>
			<p class="mt-2 text-sm opacity-80">
				Sign in to access your account and continue your journey.
			</p>
		</div>
	</div>

	<div class="lg:p-8 overflow-hidden">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h3 class="text-2xl font-semibold tracking-tight">Sign in to account</h3>
				<p class="text-muted-foreground text-sm">Log in using Google</p>
			</div>

			<Button
				variant="outline"
				type="button"
				size="lg"
				onclick={() => goto('/login/google')}
				class="w-full text-lg"
			>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
					alt="google"
					class="mr-2 h-6 w-6"
				/>
				Google
			</Button>

			<p class="text-muted-foreground px-8 text-center text-sm">
				By clicking continue, you agree to our
				<a
					href="#top"
					class="hover:text-primary underline underline-offset-4 transition-colors duration-300"
				>
					Terms of Service
				</a>
				and
				<a
					href="#top"
					class="hover:text-primary underline underline-offset-4 transition-colors duration-300"
				>
					Privacy Policy
				</a>.
			</p>
		</div>
	</div>
</div>
