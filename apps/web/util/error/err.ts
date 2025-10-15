// import type { Context } from 'hono';
// import { HTTPException as honoHttpException } from 'hono/http-exception';
import * as R from 'ramda';

import { Log } from '../log';
import type { ErrorCode, ErrorType, Status, Surface } from './types';

const errorTypeToStatus: Record<ErrorType, Status> = {
	bad_request: 400,
	unauthorized: 401,
	forbidden: 403,
	internal_server_error: 500,
};

const errorCodeToMessage: Record<ErrorCode, string> = {
	'bad_request:basiq': 'Invalid Basiq request',
	'bad_request:default': 'Invalid request',
	'unauthorized:basiq': 'Unauthorized Basiq request',
	'unauthorized:default': 'Unauthorized',
	'forbidden:basiq': 'Forbidden Basiq request',
	'forbidden:default': 'Forbidden',
	'internal_server_error:basiq': 'Internal Basiq error',
	'internal_server_error:default': 'Internal server error',
};

export class Err extends Error {
	public errorCode: ErrorCode;

	constructor(errorCode: ErrorCode, errMsg: string, error?: unknown) {
		const createCause = (errMsg: string, error?: unknown): string => {
			const errorMessage = Err.getErrorMessage(error);
			if (error && errorMessage) {
				return `${errMsg}: ${errorMessage}`;
			}
			return errMsg;
		};

		super(createCause(errMsg, error));

		this.errorCode = errorCode;

		const surface = R.pipe(R.split(':'), R.head)(errorCode) as Surface;
		const log = Log.create({ surface });
		log.error(errMsg, { errorCode, error });
	}

	public toResponse(c: Context): Response {
		const type = R.pipe(R.split(':'), R.head)(this.errorCode) as ErrorType;
		const status = Err.getStatusByType(type);

		this.message = Err.getMessageByErrorCode(this.errorCode);

		if (status === 500) {
			return c.json(
				{
					message: 'Something went wrong. Please try again later.',
				},
				status,
			);
		}

		return c.json(
			{
				code: this.errorCode,
				message: this.message,
				cause: this.cause,
			},
			status,
		);
	}

	static combine(errors: Err[]): Err {
		const cause = errors
			.map(
				(error) => `${error.errorCode}: ${error.message} Cause: ${error.cause}`,
			)
			.join(', ');
		return new Err('internal_server_error:default', cause);
	}

	public static combineErrResponses(responses: Response[]): Response {
		const json = responses.map((response) => response.json());

		return new Response(JSON.stringify(json), {
			status: 500,
		});
	}

	public static getStatusByType(type: ErrorType): Status {
		return R.propOr(500, type, errorTypeToStatus);
	}

	private static getErrorMessage(error: unknown): string | undefined {
		if (error instanceof Error) {
			return error.message;
		}
		return undefined;
	}

	public static getMessageByErrorCode(errorCode: ErrorCode): string {
		return R.propOr(
			'Something went wrong. Please try again later.',
			errorCode,
			errorCodeToMessage,
		);
	}
}

// export class HTTPException extends honoHttpException {
// 	constructor(errorCode: ErrorCode, cause?: string);
// 	constructor(error: Err);
// 	constructor(errorCodeOrError: ErrorCode | Err, cause?: string) {
// 		if (typeof errorCodeOrError === 'string') {
// 			const errorCode = errorCodeOrError;
// 			const [type, _] = errorCode.split(':');
// 			const status = Err.getStatusByType(type as ErrorType);
// 			super(status, {
// 				message: Err.getMessageByErrorCode(errorCode),
// 				cause,
// 			});
// 		} else {
// 			const err = errorCodeOrError;

// 			const [type, _] = err.errorCode.split(':');
// 			const status = Err.getStatusByType(type as ErrorType);
// 			const message = Err.getMessageByErrorCode(err.errorCode);

// 			super(status, {
// 				message,
// 				cause: err.cause,
// 			});
// 		}
// 	}
// }

// export function unwrapOrHTTPException<T, E extends Err>(
// 	result: Result<T, E>,
// ): T {
// 	if (result.isErr()) {
// 		throw new HTTPException(result.error);
// 	}

// 	return result.value;
// }
