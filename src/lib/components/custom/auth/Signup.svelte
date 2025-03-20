<script lang="ts">
	import { Input } from '$lib/components/ui/input/index';
	import { cn } from '$lib/utils.js';
	import * as Form from '$lib/components/ui/form/index';
	import { userSchema, type UserSchema } from '$lib/client/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import Spinner from '$lib/components/custom/other-components/Spinner.svelte';
	import { goto } from '$app/navigation';
	let { signup }: { signup: SuperValidated<Infer<UserSchema>> } = $props();

	const form = superForm(signup, {
		validators: zodClient(userSchema),
		taintedMessage: 'Are you sure you want to leave?',
		onUpdated({ form }) {
			if (form.message.status === 'success') {
				toast.success(form.message.text);
				goto('/chat/today');
			} else {
				toast.error(form.message.text);
			}
		}
	});
	const { form: formData, enhance } = form;

	let className = $state<string | undefined | null>(undefined);
	export { className as class };

	let isLoading = $state<boolean>(false);
</script>

<div class={cn('grid gap-6', className)}>
	<form method="POST" use:enhance action="?/signup">
		<div class="grid gap-2">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props }: { props: Record<string, any> })}
						<Form.Label>Full Name</Form.Label>
						<Input {...props} bind:value={$formData.name} placeholder="John Doe" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props }: { props: Record<string, any> })}
						<Form.Label>Email</Form.Label>
						<Input
							{...props}
							type="email"
							bind:value={$formData.email}
							placeholder="john@example.com"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props }: { props: Record<string, any> })}
						<Form.Label>Password</Form.Label>
						<Input
							{...props}
							type="password"
							bind:value={$formData.password}
							placeholder="••••••••••"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit" disabled={isLoading}>
				{#if isLoading}
					<Spinner />
				{/if}
				Create Account
			</Form.Button>
		</div>
	</form>
</div>
