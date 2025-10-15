'use server';

import { BasiqCore } from '@/basiq/core';
import { BasiqToken } from '@/basiq/token';
import { redirect } from 'next/navigation';
import { z } from 'zod/v4';

const basiq = BasiqCore.create(process.env.BASIQ_API_KEY);
const token = BasiqToken.create(process.env.BASIQ_API_KEY);

export async function createUser(_prevState: any, formData: FormData) {
	console.log('createUser', formData);
	const formSchema = z.object({
		email: z.email(),
	});

	const { data, error } = await formSchema.safeParseAsync(
		Object.fromEntries(formData),
	);

	if (error) {
		return {
			data: null,
			error: z.treeifyError(error),
		};
	}

	const { email } = data;

	const result = await basiq.createUser({
		email,
	});

	if (result.isErr()) {
		return {
			data: null,
			error: { message: 'Failed to create user' },
		};
	}

	if (!result.value.data) {
		return {
			data: null,
			error: { message: 'Failed to create user' },
		};
	}

	const basiqUserId = result.value.data.id;

	const clientToken = await token.getClientToken(basiqUserId);

	return redirect(
		`https://consent.basiq.io/home?token=${clientToken.access_token}`,
	);
}
