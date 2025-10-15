import { Err } from '@/util/error/err';

/**
 * Extract response content type for a given path, method, status code, and content type
 * Automatically extracts the 'data' property and if it's an array, extracts the element type
 * @example
 * type UserResponse = ResponseContent<'/users/{userId}', 'get', paths>
 * type JobResponse = ResponseContent<'/jobs/{jobId}', 'get', paths>
 * type JobError = ResponseContent<'/jobs/{jobId}', 'get', paths, 400>
 */
export type ResponseData<
	Path extends keyof Paths,
	Method extends keyof Paths[Path] & string,
	// biome-ignore lint/suspicious/noExplicitAny: any
	Paths extends Record<string, any>,
	Status = 200,
	ContentType extends string = 'application/json',
> = Paths[Path][Method] extends { responses: infer R }
	? Status extends keyof R
		? R[Status] extends { content: infer C }
			? // biome-ignore lint/suspicious/noExplicitAny: any
				C extends Record<string, any>
				? ContentType extends keyof C
					? NonNullable<C[ContentType]> extends { data: infer D }
						? // biome-ignore lint/suspicious/noExplicitAny: any
							D extends Array<any>
							? D[number]
							: D
						: never
					: never
				: never
			: never
		: never
	: never;

export function unwrapFetchResp<T>(result: {
	data?: T;
	error?: unknown;
	response: Response;
}): T {
	const { data, error, response } = result;

	if (data) return data;

	throw new Err(
		'internal_server_error:basiq',
		`Fetch response error: ${response.status} ${response.statusText || ''}`,
		error,
	);
}

/**
 * Extract the 'next' cursor from a Basiq pagination URL
 * @example
 * extractNextCursor('https://au-api.basiq.io/users/6a52015e/transactions?next=bf1ec9d4')
 * // Returns: 'bf1ec9d4'
 */
export function extractNextCursor(
	nextLink: string | undefined,
): string | undefined {
	if (!nextLink) return undefined;
	try {
		const url = new URL(nextLink);
		return url.searchParams.get('next') ?? undefined;
	} catch {
		return undefined;
	}
}

/**
 * Paginated response wrapper that includes cursor for easy pagination
 *
 * @example
 * // Usage in a Basiq API method:
 * async function listSomething(userId: string, options?: { cursor?: string }) {
 *   const response = await client.GET('/users/{userId}/something', {
 *     params: {
 *       path: { userId },
 *       query: { ...(options?.cursor ? { next: options.cursor } : {}) }
 *     }
 *   });
 *
 *   return {
 *     data: response.data?.data ?? [],
 *     nextCursor: extractNextCursor(response.data?.links?.next),
 *     hasMore: !!extractNextCursor(response.data?.links?.next)
 *   };
 * }
 *
 * // Using the paginated response:
 * let cursor: string | undefined;
 * do {
 *   const page = await basiq.listSomething(userId, { cursor });
 *   // Process page.data
 *   cursor = page.nextCursor;
 * } while (page.hasMore);
 */
export type PaginatedResponse<T> = {
	data: T[];
	nextCursor?: string;
	hasMore: boolean;
};
