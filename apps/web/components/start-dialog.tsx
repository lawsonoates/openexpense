'use client';

import { useActionState } from 'react';
import { Button } from './ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { createUser } from '@/app/actions';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldSet,
} from './ui/field';
import { Input } from './ui/input';
import { toast } from 'sonner';

export function StartDialog() {
	const [formState, formAction] = useActionState(
		async (_prevState: any, formData: FormData) => {
			const resp = await createUser(_prevState, formData);

			if ('message' in resp.error) {
				toast.error(resp.error.message);
				return null;
			}

			return resp;
		},
		null,
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default" size="lg">
					Get Started
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form action={formAction} className="flex flex-col gap-4">
					<DialogHeader>
						<DialogTitle>Get Started</DialogTitle>
					</DialogHeader>
					<FieldSet>
						<FieldGroup>
							<Field>
								<Input
									id="email"
									name="email"
									autoComplete="off"
									placeholder="Email"
									required
								/>
								<FieldDescription>
									Enter your email to get started. You will then be redirected
									to connect your bank.
								</FieldDescription>
								<FieldError
									errors={
										formState && 'properties' in formState.error
											? formState.error.properties?.email?.errors?.map(
													(error: string) => ({
														message: error,
													}),
												)
											: undefined
									}
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit">Connect Bank</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
