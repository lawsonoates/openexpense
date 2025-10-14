import { Focused, FocusedHeader } from '@/components/focused';

export default function Page() {
	return (
		<div className="h-full">
			<Focused>
				<FocusedHeader title="Donate">
					<p>
						OpenExpense is a free and open source project. If you find it
						useful, please consider donating to support its development.
					</p>
				</FocusedHeader>
			</Focused>
		</div>
	);
}
