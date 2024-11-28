import { isValidUrl, hasValidExtension, sanitizeUrl, getMimeType } from "@/utils/validation";
import { renderToString } from "react-dom/server";
import Head from "next/head";
import MediaPlayer from "@/components/MediaPlayer";
import { Analytics } from "@vercel/analytics/react"

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false
    }
};

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const rawUrl = req.url;
        if (!rawUrl) {
            return res.status(400).json({ error: "URL is required" });
        }

        let mediaUrl = rawUrl.replace(/^\/api\/video\//, "").replace(/^\//, "");

        // Parse the URL to handle existing query parameters
        let parsedUrl;
        try {
            parsedUrl = new URL(mediaUrl, "https://dummy.com");
        } catch (error) {
            return res.status(400).json({
                error: "Invalid URL format",
                receivedUrl: mediaUrl
            });
        }

        const forceAudio = parsedUrl.searchParams.get("a") === "audio";

        // Reconstruct the original URL without our custom parameter
        parsedUrl.searchParams.delete("a");
        mediaUrl = parsedUrl.pathname.substring(1) + parsedUrl.search;

        // Validate and fix URL
        const validatedUrl = isValidUrl(mediaUrl);
        if (!validatedUrl) {
            return res.status(400).json({
                error: "Invalid URL format.",
                receivedUrl: mediaUrl
            });
        }

        // Skip file extension check for forced audio
        if (!forceAudio && !hasValidExtension(validatedUrl)) {
            return res.status(400).json({
                error: "Invalid file type. Supported types: MP4, WebM, MOV, etc.",
                receivedUrl: validatedUrl
            });
        }

        const sanitizedUrl = sanitizeUrl(validatedUrl);
        const filename = sanitizedUrl.split("/").pop() || "media";
        const mimeType = getMimeType(sanitizedUrl, forceAudio);
        const isAudio = forceAudio || mimeType.startsWith("audio");
        const title = `${isAudio ? "Audio" : "Video"} Player - ${filename}`;

        const htmlContent = renderToString(
            <html lang="en">
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta property="og:type" content="video.other" />
                    <meta property="og:video:url" content={sanitizedUrl} />
                    <meta property="og:video:width" content="1920" />
                    <meta property="og:video:height" content="1080" />
                    <title>{title}</title>
                    <link rel="icon" href="/animated_favicon.gif" type="image/gif" />
                </Head>
                <body>
                    <MediaPlayer url={sanitizedUrl} ifType={mimeType} ifAudio={isAudio} />
                    <Analytics />
                </body>
            </html>
        );

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(200).send(`<!DOCTYPE html>${htmlContent}`);
    } catch (err) {
        console.error("Error handling request:", err);
        res.status(500).json({
            error: "Internal server error",
            details: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
}
