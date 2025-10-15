type BadRequest = {
	type: 'bad_request';
	status: 400;
	category: 'client';
};

type Unauthorized = {
	type: 'unauthorized';
	status: 401;
	category: 'client';
};

type Forbidden = {
	type: 'forbidden';
	status: 403;
	category: 'client';
};

type InternalServerError = {
	type: 'internal_server_error';
	status: 500;
	category: 'server';
};

type ErrorCatalog = {
	badRequest: BadRequest;
	unauthorized: Unauthorized;
	forbidden: Forbidden;
	internalServerError: InternalServerError;
};

type ErrorItem = ErrorCatalog[keyof ErrorCatalog];
export type Status = ErrorItem['status'];
export type ErrorType = ErrorItem['type'];

export type Surface = 'basiq' | 'default';

export type ErrorCode = `${ErrorType}:${Surface}`;
