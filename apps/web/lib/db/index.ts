import { PGlite, IdbFs } from '@electric-sql/pglite';
import { live } from '@electric-sql/pglite/live';

export const db = await PGlite.create({
	extensions: { live },
	fs: new IdbFs('bank-data'),
});

// export const db = drizzle(client, {
// 	schema,
// });
