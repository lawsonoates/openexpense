import { ResultAsync } from 'neverthrow';

import { Err } from './error/err';
import type { Surface } from './error/types';

export function createSafeQuery(surface: Surface) {
	return <T, Args extends unknown[]>(
		query: (...args: Args) => Promise<T>,
		errMsg: string,
	): ((...args: Args) => ResultAsync<T, Err>) => {
		// Create a function that preserves the original parameter count for resultAsyncPipe
		const wrappedFunction = (...args: Args) =>
			ResultAsync.fromThrowable(
				() => query(...args),
				(error: unknown) => {
					return new Err(`internal_server_error:${surface}`, errMsg, error);
				},
			)();

		// Manually set the length property to match the original function
		Object.defineProperty(wrappedFunction, 'length', {
			value: query.length,
			writable: false,
			enumerable: false,
			configurable: true,
		});

		return wrappedFunction;
	};
}
