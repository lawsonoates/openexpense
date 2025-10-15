'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import type { Transaction } from './queries';

export const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: 'amount',
		header: 'Amount',
	},
	{
		accessorKey: 'transaction_date',
		header: 'Transaction Date',
		cell: ({ row }) => {
			const date = row.getValue('transaction_date') as string;
			return format(new Date(date), 'PPp');
		},
	},
	{
		accessorKey: 'direction',
		header: 'Direction',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'reference',
		header: 'Reference',
	},
];
