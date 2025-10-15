'use client';

import { PGliteProvider } from '@electric-sql/pglite-react';
import { Focused, FocusedContent } from '@/components/focused';
import { useEffect, useState } from 'react';
import { live, type PGliteWithLive } from '@electric-sql/pglite/live';
import { IdbFs, PGlite } from '@electric-sql/pglite';
import { createTable } from './queries';

export default function Layout(props: LayoutProps<'/transactions'>) {
	const [db, setDb] = useState<PGliteWithLive | undefined>(undefined);

	useEffect(() => {
		const initDb = async () => {
			const db = await PGlite.create({
				extensions: { live },
				fs: new IdbFs('bank-data'),
			});

			// Create the table before making the db available
			await createTable(db);

			setDb(db);
		};

		initDb();
	}, []);

	if (!db) {
		return <div>Loading database...</div>;
	}

	return (
		<PGliteProvider db={db}>
			<Focused>
				<FocusedContent>{props.children}</FocusedContent>
			</Focused>
		</PGliteProvider>
	);
}
