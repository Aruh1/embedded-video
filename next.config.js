module.exports = {
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: "/api/video/:path*" // Ensure it points to the API route
            }
        ];
    },
    trailingSlash: false
};
