'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Landing() {
	return (
		<>
			<header className="w-full">
				<div className="container flex h-14 items-center">
					<nav className="flex flex-1 gap-4">
						<div className="flex gap-2 items-center">
							<Link href="/">
								<span className="type-brand">OpenExpense</span>
							</Link>
						</div>
					</nav>
					<div className="flex items-center gap-2">
						<Button variant="ghost" asChild>
							<Link href="/donate">Donate</Link>
						</Button>
						<Button variant="ghost" asChild>
							<Link href="https://github.com/lawsonoates/openexpense">
								GitHub
							</Link>
						</Button>
					</div>
				</div>
			</header>
			<main className="flex-1 min-h-0 container">
				{/* <section className="w-full py-12 md:py-24 lg:py-28 xl:py-32 bg-secondary"> */}
				{/* <section className="flex h-full w-full py-12 container bg-red-100"> */}
				{/* <div className="container mx-auto px-4 md:px-6 flex justify-between"> */}
				<div className="my-auto flex flex-col gap-10 items-start align-start py-12 md:py-24 lg:py-28 xl:py-32">
					<h1 className="type-md lg:type-lg max-w-[800px]">
						Download your bank account expenses into a spreadsheet. Open source
						and free to use. Zero data retention.
					</h1>
					<div className="flex flex-col gap-2 items-center">
						<Button variant="default" size="lg" asChild>
							<Link href="/signup/admin">Get Started</Link>
						</Button>
					</div>
				</div>
				{/* </div> */}
				{/* </section> */}
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
				<div className="flex justify-between w-full type-sm text-gray-500 dark:text-gray-400">
					<p>© 2025 OpenExpense</p>
					<nav>
						<Link href="/privacy">Privacy Policy</Link>
					</nav>
				</div>
			</footer>
		</>
	);
}
