import createClient from 'openapi-fetch';

import type { paths } from './type';

export const client = createClient<paths>({
	baseUrl: 'https://au-api.basiq.io/',
});
