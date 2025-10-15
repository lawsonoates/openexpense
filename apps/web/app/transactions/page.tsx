'use client';

import { Button } from '@/components/ui/button';
import { useLiveQuery, usePGlite } from '@electric-sql/pglite-react';
import { getTransactions } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { insertTransaction, type Transaction } from './queries';

export default function Page() {
	const db = usePGlite();

	const transactions = useLiveQuery(
		`
        SELECT id, status, description, reference, amount, currency, account, 
               balance, direction, class, institution, connection, 
               transaction_date, post_date
        FROM transactions
        ORDER BY post_date DESC
        LIMIT 10;
      `,
	);

	const fetchPage = async () => {
		const { data } = await getTransactions();

		for (const transaction of data) {
			await insertTransaction(transaction, db);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div>
				<Button onClick={fetchPage}>Get Transactions</Button>
			</div>
			<div>
				{transactions?.rows ? (
					<DataTable
						columns={columns}
						data={transactions?.rows as Transaction[]}
					/>
				) : (
					<div>No transactions</div>
				)}
			</div>
		</div>
	);
}
