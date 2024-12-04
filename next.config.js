module.exports = {
    experimental: {
        serverExternalPackages: ["formidable"],
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
    trailingSlash: false
};
