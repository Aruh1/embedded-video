/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: "/api/video/:path*"
            }
        ];
    }
};

module.exports = nextConfig;
