module.exports = {
    experimental: {
        serverComponentsExternalPackages: ["formidable"]
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
