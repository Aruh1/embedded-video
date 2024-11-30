module.exports = {
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
