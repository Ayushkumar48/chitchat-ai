<script lang="ts">
	import Login from '$lib/components/custom/auth/Login.svelte';
	import Signup from '$lib/components/custom/auth/Signup.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { fade, fly, slide } from 'svelte/transition';
	import { cubicInOut, quintIn } from 'svelte/easing';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let login = $state<boolean>(true);
	let transitioning = $state<boolean>(false);
	let containerHeight = $state<number>(0);
	let loginRef = $state<HTMLElement>();
	let signupRef = $state<HTMLElement>();

	function toggleForm() {
		transitioning = true;
		containerHeight = login ? signupRef?.offsetHeight || 350 : loginRef?.offsetHeight || 300;
		setTimeout(() => {
			login = !login;
			setTimeout(() => {
				containerHeight = login ? loginRef?.offsetHeight || 300 : signupRef?.offsetHeight || 350;
				transitioning = false;
			}, 10);
		}, 100);
	}

	onMount(() => {
		containerHeight = login ? loginRef?.offsetHeight || 300 : signupRef?.offsetHeight || 350;
	});
</script>

<div
	class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button
		onclick={toggleForm}
		variant="ghost"
		class="absolute right-4 top-4 md:right-8 md:top-8 transition-all duration-200 hover:scale-105 ease-in-out"
		disabled={transitioning}
	>
		{#key login}
			<span in:fade={{ duration: 200 }}>
				{login ? 'Signup' : 'Login'}
			</span>
		{/key}
	</Button>

	<div
		class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden"
	>
		<div
			class="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
			in:fade={{ duration: 200, delay: 200 }}
		></div>
		<div
			class="relative z-10 mt-auto"
			in:fly={{ y: 20, duration: 400, delay: 500, easing: cubicInOut }}
		>
			<h3 class="text-xl font-medium">{login ? 'Welcome back' : 'Join our community'}</h3>
			<p class="mt-2 text-sm opacity-80">
				{login
					? 'Sign in to access your account and continue your journey.'
					: 'Create an account to get started and explore our services.'}
			</p>
		</div>
	</div>

	<div class="lg:p-8 overflow-hidden">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div
				class="flex flex-col space-y-2 text-center"
				in:fly={{ y: -20, duration: 500, delay: 100, easing: cubicInOut }}
			>
				<h1 class="text-2xl font-semibold tracking-tight">
					{#key login}
						<span
							in:slide={{ duration: 400, delay: 300, easing: cubicInOut }}
							out:slide={{ duration: 200, easing: quintIn }}
						>
							{login ? 'Sign in to account' : 'Create an account'}
						</span>
					{/key}
				</h1>
				<p class="text-muted-foreground text-sm">
					{#key login}
						<span in:fade={{ duration: 400, delay: 400 }}>
							{login
								? 'Enter your credentials below to login to your account'
								: 'Enter your details below to create your account'}
						</span>
					{/key}
				</p>
			</div>
			<div
				class="relative transition-all duration-500 ease-in-out"
				style="height: {containerHeight}px;"
			>
				{#if login}
					<div
						class="absolute w-full"
						bind:this={loginRef}
						in:fly={{ x: -30, duration: 500, delay: 300, easing: cubicInOut }}
						out:fly={{ x: 30, duration: 300, easing: quintIn }}
					>
						<Login />
					</div>
				{:else}
					<div
						class="absolute w-full"
						bind:this={signupRef}
						in:fly={{ x: 30, duration: 500, delay: 300, easing: cubicInOut }}
						out:fly={{ x: -30, duration: 300, easing: quintIn }}
					>
						<Signup signup={data.signup} />
					</div>
				{/if}
			</div>
			<div class="w-full" in:fade={{ duration: 400, delay: 600 }}>
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
</div>
