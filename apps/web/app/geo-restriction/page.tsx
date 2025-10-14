import { Focused, FocusedHeader } from '@/components/focused';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
	return (
		<div className="h-full">
			<Focused>
				<FocusedHeader title="Geo Restriction">
					<p>
						Currently only available in Australia. OpenExpense uses an Open
						Banking API made available by{' '}
						<Button variant="link" className="p-0 underline" asChild>
							<Link href="https://en.wikipedia.org/wiki/Consumer_Data_Right">
								CDR
							</Link>
						</Button>{' '}
						legislation.
					</p>
				</FocusedHeader>
			</Focused>
		</div>
	);
}
