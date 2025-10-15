import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { z } from 'zod/v4';

export function UserForm({
	formState,
}: {
	formState:
		| null
		| { data: { email: string } }
		| { error: z.ZodError<{ email: string }> };
}) {
	return (
		<FieldSet>
			{/* <FieldLegend>Get Started</FieldLegend>
			<FieldDescription>This appears on invoices and emails.</FieldDescription> */}
			<FieldGroup>
				<Field>
					{/* <FieldLabel htmlFor="email">Email</FieldLabel> */}
					<Input id="email" autoComplete="off" placeholder="Email" required />
					<FieldDescription>
						Enter your email to get started. This will not be used for any other
						purpose than to retrieve your bank data.
					</FieldDescription>
				</Field>
			</FieldGroup>
		</FieldSet>
	);
}
