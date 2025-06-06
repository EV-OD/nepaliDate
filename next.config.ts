import type {NextConfig} from 'next';
import path from 'path'; // Import path module

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This option helps include files that Next.js's automatic tracing might miss,
    // especially when using dynamic fs operations like readdir.
    // It ensures that the specified files/folders are bundled with the serverless functions.
    // We want to include all contents of the './data' directory for any server-side code
    // that might be generated from the 'app' directory.
    outputFileTracingIncludes: {
      'app/**': ['./data/**/*'], // Include all files and subdirectories under data for app router
    },
    // Setting the root for outputFileTracing can sometimes help ensure paths are resolved correctly.
    outputFileTracingRoot: path.join(__dirname),
  },
};

export default nextConfig;
