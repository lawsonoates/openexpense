'use server';

import { BasiqData } from '@/basiq/data';

const basiq = BasiqData.create(process.env.BASIQ_API_KEY);

export async function getTransactions() {
	const userId = '90fe7cd9-bcfb-4ee1-a788-91203fde2b4d';

	const transactions = await basiq.listTransactions(userId, {
		limit: 10,
	});

	if (transactions.isErr()) {
		throw new Error(transactions.error.message);
	}

	return transactions.value;
}
