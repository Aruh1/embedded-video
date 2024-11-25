import { isValidUrl, hasValidProtocol, hasValidExtension, sanitizeUrl, getMimeType } from "@/utils/validation";

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false
    }
};

export default async function handler(req, res) {
    try {
        const rawUrl = req.url;
        let mediaUrl = rawUrl.replace(/^\/api\/video\//, "").replace(/^\//, "");

        // Parse the URL to handle existing query parameters
        const parsedUrl = new URL(mediaUrl, "https://dummy.com");
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
        let mimeType = getMimeType(sanitizedUrl, forceAudio);

        const isAudio = forceAudio || mimeType.startsWith("audio");

        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isAudio ? "Audio" : "Video"} Player - ${filename}</title>
        <link rel="shortcut icon" href="https://ptpimg.me/animated_favicon.gif">
        <style>
          body {
            margin: 0;
            background-color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
          }
          video, audio {
            max-width: 100vw;
            max-height: 100vh;
            outline: none;
          }
        </style>
      </head>
      <body>
        ${
            isAudio
                ? `<audio controls autoplay>
                <source src="${sanitizedUrl}" type="${mimeType}">
                Your browser does not support audio playback.
              </audio>`
                : `<video controls autoplay>
                <source src="${sanitizedUrl}" type="${mimeType}">
                Your browser does not support video playback.
              </video>`
        }
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
