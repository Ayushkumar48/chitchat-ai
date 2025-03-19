import { z } from 'zod';

export const userSchema = z.object({
	name: z.string().min(1, { message: "Name can't be empty." }),
	email: z.string().email(),
	password: z.string().min(8, {
		message: 'Password must contain atleast 8 characters with atleast 1 number and 1 alphabet.'
	}),
	image: z
		.instanceof(File)
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: 'File size must be less than 5MB'
		})
		.optional()
});

export type UserSchema = typeof userSchema;
