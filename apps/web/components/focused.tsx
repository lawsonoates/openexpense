import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export function Focused({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-secondary text-secondary-foreground flex flex-col w-full h-full justify-center py-12 sm:px-6 lg:px-8">
			<h3 className="mx-auto mb-auto">
				<Link href="/">
					<span className="type-brand">OpenExpense</span>
				</Link>
			</h3>
			{/* <div className="mb-auto mt-0 sm:mx-auto sm:w-full sm:max-w-md flex flex-col gap-8"> */}
			<div className="mb-auto mt-0 sm:mx-auto sm:w-full sm:max-w-7xl flex flex-col gap-8">
				{children}
			</div>
		</div>
	);
}

export function FocusedHeader({
	title,
	children,
}: {
	title: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col gap-4 text-center">
			<h2 className="type-md lg:type-lg">{title}</h2>
			{children && (
				<div className="type-base text-theme-text-secondary text-pretty">
					{children}
				</div>
			)}
		</div>
	);
}

export function FocusedContent({ children }: { children: React.ReactNode }) {
	return (
		<Card className="border-none shadow-sm mx-4 p-0">
			<CardContent className="p-6">{children}</CardContent>
		</Card>
	);
}
