import { createSafeQuery } from '@/util/safe-query';
import { client } from './client';
import { BasiqToken } from '../token';
import type { paths } from './type';
import type { ResponseData } from '../util';

export namespace BasiqCore {
	const safe = createSafeQuery('basiq');

	export type RetrieveJobContent = ResponseData<'/jobs/{jobId}', 'get', paths>;
	export type RetrieveUserContent = ResponseData<
		'/users/{userId}',
		'get',
		paths
	>;

	export function create(apiKey: string) {
		const token = BasiqToken.create(apiKey);

		return {
			createUser: safe(
				async ({ email }: { email: string }) =>
					client.POST('/users', {
						headers: {
							Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: {
							email,
						},
					}),
				'Failed to create user',
			),
			getUser: safe(
				async (userId: string) =>
					client.GET('/users/{userId}', {
						params: {
							path: {
								userId,
							},
						},
						headers: {
							Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
						},
					}),
				'Failed to get user',
			),
			getEventTypes: safe(
				async () =>
					client.GET('/events/types', {
						headers: {
							Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
						},
					}),
				'Failed to get event types',
			),
			retrieveJob: safe(
				async (jobId: string) =>
					client.GET('/jobs/{jobId}', {
						params: {
							path: {
								jobId,
							},
						},
						headers: {
							Authorization: `Bearer ${(await token.getServerToken()).access_token}`,
						},
					}),
				'Failed to retrieve job',
			),
		};
	}
}
