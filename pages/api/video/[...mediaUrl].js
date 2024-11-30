import { isValidUrl, hasValidExtension, sanitizeUrl, getMimeType } from "@/utils/validation";

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false
    }
};

export default async function handler(req, res) {
    try {
        // Extract raw URL
        const rawUrl = req.url;
        let mediaUrl = decodeURIComponent(rawUrl.replace(/^\/api\/video\//, "").replace(/^\//, ""));

        const parsedUrl = new URL(mediaUrl, "https://dummy.com");

        // Ambil dan sanitasi parameter query
        const forceAudio = parsedUrl.searchParams.get("a") === "audio";
        const rawThumbnailUrl = parsedUrl.searchParams.get("i");
        const thumbnailWidth = parsedUrl.searchParams.get("w") || "1920";
        const thumbnailHeight = parsedUrl.searchParams.get("h") || "1080";

        // Bersihkan parameter query dari media URL
        parsedUrl.searchParams.delete("a");
        parsedUrl.searchParams.delete("i");
        parsedUrl.searchParams.delete("w");
        parsedUrl.searchParams.delete("h");

        mediaUrl = decodeURIComponent(parsedUrl.pathname.substring(1) + parsedUrl.search);

        // Validasi dan sanitasi media URL
        const validatedUrl = isValidUrl(mediaUrl);
        if (!validatedUrl) {
            return res.status(400).json({
                error: "Invalid URL format.",
                receivedUrl: mediaUrl
            });
        }

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
        const MediaTag = isAudio ? "audio" : "video";

        const sanitizedThumbnailUrl = rawThumbnailUrl ? decodeURIComponent(sanitizeUrl(rawThumbnailUrl)) : null;

        // Generate HTML response
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <!-- Open Graph Metadata -->
            <meta property="og:type" content="${isAudio ? "music.song" : "video.other"}">
            <meta property="og:url" content="${sanitizedUrl}">
            <meta id="og-width" property="og:video:width" content="${thumbnailWidth}">
            <meta id="og-height" property="og:video:height" content="${thumbnailHeight}">
            <meta property="og:video:url" content="${sanitizedUrl}">
            <meta property="og:video:secure_url" content="${sanitizedUrl}">
            <meta property="og:video:type" content="${mimeType}">
            ${sanitizedThumbnailUrl ? `<meta property="og:image" content="${sanitizedThumbnailUrl}">` : ""}
            
            <!-- Twitter Card Metadata -->
            <meta name="twitter:card" content="${isAudio ? "audio" : "player"}">
            <meta name="twitter:player:stream" content="${sanitizedUrl}">
            <meta name="twitter:player" content="${sanitizedUrl}">
            <meta id="twitter-width" name="twitter:player:width" content="${thumbnailWidth}">
            <meta id="twitter-height" name="twitter:player:height" content="${thumbnailHeight}">
            ${sanitizedThumbnailUrl ? `<meta name="twitter:image" content="${sanitizedThumbnailUrl}">` : ""}
            
            <title>${isAudio ? "Audio" : "Video"} Player - ${filename}</title>
            <link rel="icon" type="image/x-icon" href="/animated_favicon.gif" />
            <style>
                body { 
                    margin: 0; 
                    background: black; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh; 
                }
                .media-container { 
                    position: relative;
                    max-width: 100%; 
                    max-height: 100vh; 
                }
                ${MediaTag} { 
                    max-width: 100%; 
                    max-height: 100vh; 
                }
            </style>
        </head>
        <body>
            <div class="media-container">
                <${MediaTag} 
                    id="media-player" 
                    controls 
                    autoplay
                    poster="${sanitizedThumbnailUrl || ""}"
                    style="display:none;"
                >
                    <source src="${sanitizedUrl}" type="${mimeType}" />
                    Your browser does not support ${MediaTag} playback.
                </${MediaTag}>
            </div>

            <script>
                const mediaPlayer = document.getElementById('media-player');
                const thumbnail = document.querySelector('.thumbnail');
                
                mediaPlayer.addEventListener('loadedmetadata', () => {
                    mediaPlayer.style.display = 'block';
                    const width = mediaPlayer.videoWidth || ${thumbnailWidth};
                    const height = mediaPlayer.videoHeight || ${thumbnailHeight};

                    document.getElementById('twitter-width').setAttribute('content', width);
                    document.getElementById('twitter-height').setAttribute('content', height);
                    document.getElementById('og-width').setAttribute('content', width);
                    document.getElementById('og-height').setAttribute('content', height);
                });

                mediaPlayer.addEventListener('play', () => {
                    if (thumbnail) thumbnail.style.display = 'none';
                });

                mediaPlayer.addEventListener('error', (e) => {
                    console.error('Media load error:', e);
                });
            </script>
        </body>
        </html>
        `;

        res.setHeader("Content-Type", "text/html");
        res.status(200).send(html);
    } catch (err) {
        console.error("Error handling request:", err);
        res.status(500).json({
            error: "Internal server error",
            details: err.message
        });
    }
}
