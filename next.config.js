/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        webpackMemoryOptimizations: true
    },
    async rewrites() {
        return [
            {
                source: "/:url*",
                destination: "/api/video/:url*"
            }
        ];
    },
    trailingSlash: false,
    reactStrictMode: true
};

module.exports = nextConfig;
