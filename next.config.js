/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        webpackMemoryOptimizations: true
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on"
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload"
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block"
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN"
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin"
                    }
                ]
            }
        ];
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
