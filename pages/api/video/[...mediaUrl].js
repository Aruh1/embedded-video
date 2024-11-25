import { isValidUrl, hasValidProtocol, hasValidExtension, sanitizeUrl, getMimeType } from "@/utils/validation";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default function handler(req, res) {
  try {
    // Get the raw URL from the request
    const rawUrl = req.url;

    // Extract the media URL by removing the API path and leading slashes
    let mediaUrl = rawUrl.replace(/^\/api\/video\//, "").replace(/^\//, "");

    // Ensure protocols like `http:/` or `https:/` are fixed
    if (/^https?:\/[^/]/.test(mediaUrl)) {
      // Add the missing slash after the protocol
      mediaUrl = mediaUrl.replace(/^(https?:\/)([^/])/, "$1/$2");
    }

    // Check if query parameter `a=audio` exists
    const urlParams = new URLSearchParams(rawUrl.split('?')[1] || "");
    const forceAudio = urlParams.has('a') && urlParams.get('a') === 'audio';

    console.log("Raw URL:", rawUrl);
    console.log("Processed URL:", mediaUrl);
    console.log("Force Audio:", forceAudio);

    // Validate the reconstructed URL
    if (!isValidUrl(mediaUrl)) {
      return res.status(400).json({
        error: "Invalid URL format.",
        receivedUrl: mediaUrl,
        rawUrl: rawUrl,
      });
    }

    // Ensure that the protocol is valid (http:// or https://)
    if (!hasValidProtocol(mediaUrl)) {
      return res.status(400).json({ error: "URL must start with https:// or http://" });
    }

    // If `forceAudio` is true, bypass the file extension validation
    if (!forceAudio && !hasValidExtension(mediaUrl)) {
      return res.status(400).json({ error: "Invalid file type." });
    }

    // Sanitize URL for safety
    const sanitizedUrl = sanitizeUrl(mediaUrl);
    const filename = sanitizedUrl.split("/").pop();
    let mimeType = getMimeType(sanitizedUrl);

    // If 'forceAudio' is true, override the MIME type to audio
    if (forceAudio) {
      mimeType = "audio/mpeg"; // Set to a common audio MIME type (or adjust based on your needs)
    }

    // Generate the HTML response with either audio or video player
    const isAudio = forceAudio || mimeType.startsWith("audio");

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:type" content="video.other">
        <meta property="og:video:url" content="${sanitizedUrl}">
        <meta property="og:video:width" content="1920">
        <meta property="og:video:height" content="1080">
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
          }
          video, audio {
            max-width: 100vw;
            max-height: 100vh;
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
    res.status(500).json({ error: "Internal server error" });
  }
}
