import { client } from './client';
import { createSafeQuery } from '@/util/safe-query';
import { BasiqToken } from '../token';
import type { paths } from './type';
import type { ResponseData, PaginatedResponse } from '../util';
import { unwrapFetchResp, extractNextCursor } from '../util';

const safe = createSafeQuery('basiq');

export namespace BasiqData {
	export type ListAccountsContent = ResponseData<
		'/users/{userId}/accounts',
		'get',
		paths
	>;

	export type ListTransactionsContent = ResponseData<
		'/users/{userId}/transactions',
		'get',
		paths
	>;

	export function create(apiKey: string) {
		const token = BasiqToken.create(apiKey);

		return {
			listAccounts: safe(async (userId: string) => {
				return client
					.GET('/users/{userId}/accounts', {
						params: {
							path: {
								userId,
							},
						},
						headers: {
							Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
						},
					})
					.then(unwrapFetchResp);
			}, 'Failed to list accounts'),

			listTransactions: safe(
				async (
					userId: string,
					options?: {
						filter?: {
							accountId?: string;
							status?: 'posted' | 'pending';
						};
						limit?: number;
						cursor?: string;
					},
				): Promise<PaginatedResponse<ListTransactionsContent>> => {
					const filters: string[] = [];
					if (options?.filter?.accountId) {
						filters.push(`account.id.eq('${options.filter.accountId}')`);
					}
					if (options?.filter?.status) {
						filters.push(`transaction.status.eq('${options.filter.status}')`);
					}

					const response = await client.GET('/users/{userId}/transactions', {
						params: {
							path: {
								userId,
							},
							query: {
								...(filters.length > 0 ? { filter: filters.join(',') } : {}),
								...(options?.limit ? { limit: options.limit } : {}),
								...(options?.cursor ? { next: options.cursor } : {}),
							},
						},
						headers: {
							Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
						},
					});

					const data = response.data?.data ?? [];
					const nextLink = response.data?.links?.next;
					const nextCursor = extractNextCursor(nextLink);

					return {
						data,
						nextCursor,
						hasMore: !!nextCursor,
					};
				},
				'Failed to list transactions',
			),

			listConnections: safe(async (userId: string) => {
				return client.GET('/users/{userId}/connections', {
					params: {
						path: { userId },
					},
					headers: {
						Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
					},
				});
			}, 'Failed to list connections'),

			// ConnectionData: OkTypeOf<typeof listConnections>['data'],

			refreshConnection: safe(async (userId: string, connectionId: string) => {
				return client.POST(
					'/users/{userId}/connections/{connectionId}/refresh',
					{
						params: {
							path: { userId, connectionId },
						},
						headers: {
							Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
						},
					},
				);
			}, 'Failed to refresh connection'),
		};
	}
}
