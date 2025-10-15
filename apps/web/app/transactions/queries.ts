import type { BasiqData } from '@/basiq/data';
import type { PGliteWithLive } from '@electric-sql/pglite/live';

export type Transaction = Omit<
	BasiqData.ListTransactionsContent,
	'type' | 'enrich' | 'links' | 'subClass' | 'paymentDetails'
>;

export async function createTable(db: PGliteWithLive) {
	await db.exec(
		`CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            status TEXT,
            description TEXT,
            reference TEXT,
            amount TEXT,
            currency TEXT,
            account TEXT,
            balance TEXT,
            direction TEXT,
            class TEXT,
            institution TEXT,
            connection TEXT,
            transaction_date TEXT,
            post_date TEXT
        )`,
	);
}

export async function insertTransaction(
	transaction: Transaction,
	db: PGliteWithLive,
) {
	await db.query(
		`INSERT INTO transactions (
            id, status, description, reference, amount, currency, 
            account, balance, direction, class, institution, connection, 
            transaction_date, post_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            description = EXCLUDED.description,
            reference = EXCLUDED.reference,
            amount = EXCLUDED.amount,
            currency = EXCLUDED.currency,
            account = EXCLUDED.account,
            balance = EXCLUDED.balance,
            direction = EXCLUDED.direction,
            class = EXCLUDED.class,
            institution = EXCLUDED.institution,
            connection = EXCLUDED.connection,
            transaction_date = EXCLUDED.transaction_date,
            post_date = EXCLUDED.post_date
        `,
		[
			transaction.id,
			transaction.status,
			transaction.description,
			transaction.reference,
			transaction.amount,
			transaction.currency,
			transaction.account,
			transaction.balance,
			transaction.direction,
			transaction.class,
			transaction.institution,
			transaction.connection,
			transaction.transactionDate,
			transaction.postDate,
		],
	);
}
