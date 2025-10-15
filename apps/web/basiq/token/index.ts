import { createSafeQuery } from '@/util/safe-query';
import { client } from '../core/client';
import { Err } from '@/util/error/err';

export namespace BasiqToken {
	export type Scope = 'CLIENT_ACCESS' | 'SERVER_ACCESS';

	export type ServerToken = {
		access_token: string;
		expires_in: number;
		token_type: string;
		fetched_at: number;
	};

	type ClientToken = {
		access_token: string;
	};

	// let lastFetchedAt: number | undefined;

	let serverToken: ServerToken | undefined;

	function hasTokenExpired(token: ServerToken): boolean {
		const now = Date.now();

		if (!token.fetched_at) {
			return true;
		}

		const tokenAge = now - token.fetched_at;
		// Add 30 second buffer to ensure token doesn't expire during use
		const expiryTimeMs = (token.expires_in - 30) * 1000;
		return tokenAge >= expiryTimeMs;
	}

	export function create(apiKey: string) {
		return {
			getServerToken: async (): Promise<ServerToken> => {
				// Return cached token if it exists, matches scope, and hasn't expired
				if (serverToken && !hasTokenExpired(serverToken)) {
					return serverToken;
				}

				return await fetchToken(apiKey)('SERVER_ACCESS').match(
					(response) => {
						if (response.data) {
							const data = {
								access_token: response.data.access_token,
								expires_in: response.data.expires_in,
								token_type: response.data.token_type,
								fetched_at: Date.now(),
							} as ServerToken;

							serverToken = data;

							return data;
						}

						throw new Err(
							'internal_server_error:basiq',
							'Failed to fetch server token',
							response.error,
						);
					},
					(err) => {
						throw err;
					},
				);
			},

			getClientToken: async (userId: string): Promise<ClientToken> => {
				return await fetchToken(apiKey)('CLIENT_ACCESS', userId).match(
					(response) => {
						if (response.data) {
							return response.data;
						}

						throw new Err(
							'internal_server_error:basiq',
							'Failed to fetch client token',
							response.error,
						);
					},
					(err) => {
						throw err;
					},
				);
			},
		};
	}

	function fetchToken(apiKey: string) {
		const safe = createSafeQuery('basiq');

		return safe(
			async (scope: BasiqToken.Scope, userId?: string) =>
				client.POST('/token', {
					params: {
						header: {
							'basiq-version': '3.0',
							Authorization: `Basic ${apiKey}`,
							Accept: 'application/json',
							'content-type': 'application/x-www-form-urlencoded',
						},
					},
					body:
						scope === 'CLIENT_ACCESS'
							? {
									scope,
									userId,
								}
							: {
									scope,
								},
				}),
			'Failed to fetch token',
		);
	}
}
