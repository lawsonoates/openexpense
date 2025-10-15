// based on code from https://github.com/sst/opencode

import z from 'zod';

import type { Surface } from './error/types';

export namespace Log {
	export const Level = z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']);
	export type Level = z.infer<typeof Level>;

	const levelPriority: Record<Level, number> = {
		DEBUG: 0,
		INFO: 1,
		WARN: 2,
		ERROR: 3,
	};

	const level: Level = 'INFO';
	const logpath = '';

	export function file() {
		return logpath;
	}

	export interface Options {
		print: boolean;
		dev?: boolean;
		level?: Level;
		logDir: string;
	}

	export type Logger = {
		debug(message?: any, extra?: Record<string, any>): void;
		info(message?: any, extra?: Record<string, any>): void;
		error(message?: any, extra?: Record<string, any>): void;
		warn(message?: any, extra?: Record<string, any>): void;
		tag(key: string, value: string): Logger;
		clone(): Logger;
		time(
			message: string,
			extra?: Record<string, any>,
		): {
			stop(): void;
			[Symbol.dispose](): void;
		};
	};

	const loggers = new Map<string, Logger>();
	let last = Date.now();

	/**
	 * Creates a logger with typed service tags.
	 * @param tags - Metadata for the logger. `service` must be a valid `Surface`.
	 * @see {@link Surface} in `src/lib/errors` for valid values.
	 */
	export function create(
		tags?: { surface?: Surface } & Record<string, any>,
	): Logger {
		tags = tags || {};
		const surface = tags.surface;
		if (surface && typeof surface === 'string') {
			const cached = loggers.get(surface);
			if (cached) return cached;
		}

		function build(message: any, extra?: Record<string, any>) {
			const prefix = Object.entries({ ...tags, ...extra })
				.filter(([, v]) => v != null)
				.map(
					([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`,
				)
				.join(' ');
			const now = Date.now();
			const diff = now - last;
			last = now;
			return `${[
				new Date(now).toISOString().split('.')[0],
				`+${diff}ms`,
				prefix,
				message,
			]
				.filter(Boolean)
				.join(' ')}\n`;
		}

		const logger: Logger = {
			debug(msg, extra) {
				if (shouldLog('DEBUG'))
					process.stderr.write(`DEBUG ${build(msg, extra)}`);
			},
			info(msg, extra) {
				if (shouldLog('INFO'))
					process.stderr.write(`INFO  ${build(msg, extra)}`);
			},
			warn(msg, extra) {
				if (shouldLog('WARN'))
					process.stderr.write(`WARN  ${build(msg, extra)}`);
			},
			error(msg, extra) {
				if (shouldLog('ERROR'))
					process.stderr.write(`ERROR ${build(msg, extra)}`);
			},
			tag(key, value) {
				tags[key] = value;
				return logger;
			},
			clone() {
				return create({ ...tags });
			},
			time(message, extra) {
				const start = Date.now();
				logger.info(message, { status: 'started', ...extra });
				const stop = () =>
					logger.info(message, {
						status: 'completed',
						duration: Date.now() - start,
						...extra,
					});
				return {
					stop,
					[Symbol.dispose]() {
						stop();
					},
				};
			},
		};

		if (surface && typeof surface === 'string') {
			loggers.set(surface, logger);
		}

		return logger;
	}

	function shouldLog(input: Level): boolean {
		if (process.env.NODE_ENV === 'development') return true;

		return levelPriority[input] >= levelPriority[level];
	}

	export const Default = create({ surface: 'default' });
}
