import { hash, verify } from '@node-rs/argon2';
import { type Actions } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { message, superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/client/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import type { PageData } from './$types';
export async function load(): Promise<PageData> {
	return {
		signup: await superValidate(zod(userSchema))
	};
}

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		try {
			const results = await db.select().from(users).where(eq(users.email, email));

			const existingUser = results.at(0);

			if (!existingUser) {
				return fail(400, { status: 400, message: 'Incorrect username or password' });
			}

			if (!existingUser.password) {
				return fail(400, {
					status: 400,
					message: 'This account is authorized with Google. Please login using Google.'
				});
			}

			const validPassword = await verify(existingUser.password, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			if (!validPassword) {
				return fail(400, { status: 400, message: 'Incorrect credentials' });
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			return { status: 200, message: 'User logged in!' };
		} catch (error) {
			console.error(error);
			return fail(500, { status: 500, message: 'An error has occurred!' });
		}
	},

	signup: async (event) => {
		const form = await superValidate(event, zod(userSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const [existingUser] = await db
				.select()
				.from(users)
				.where(eq(users.email, form.data.email as string));
			if (existingUser?.googleId) {
				return message(
					form,
					{
						status: 'error',
						text: 'This email and/or username are linked to a Google account. Please log in using Google.'
					},
					{ status: 403 }
				);
			}
			if (existingUser?.email === form.data.email) {
				return message(form, { status: 'error', text: 'Email already exists.' }, { status: 403 });
			}

			if (existingUser?.email === form.data.email) {
				return message(form, { status: 'error', text: 'Email already exists.' }, { status: 403 });
			}
			const userId = auth.generateUserId();
			const passwordHash = await hash(form.data.password as string, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			await db.insert(users).values({
				id: userId,
				name: form.data.name,
				email: form.data.email,
				password: passwordHash
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			return message(form, { status: 'success', text: 'Account created successfully!' });
		} catch (error) {
			console.error(error);
			return message(form, { status: 'error', text: 'An error has occurred' }, { status: 500 });
		}
	}
};
