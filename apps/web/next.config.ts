import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: [
		'@electric-sql/pglite-react', // Optional
		'@electric-sql/pglite',
	],
};

export default nextConfig;
