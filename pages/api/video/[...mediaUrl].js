import { isValidUrl, hasValidExtension, sanitizeUrl, getMimeType } from "@/utils/validation";

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

        const parsedUrl = new URL(mediaUrl, "https://dummy.com");
        const forceAudio = parsedUrl.searchParams.get("a") === "audio";

        parsedUrl.searchParams.delete("a");
        mediaUrl = parsedUrl.pathname.substring(1) + parsedUrl.search;

        const validatedUrl = isValidUrl(mediaUrl);
        if (!validatedUrl) {
            return res.status(400).json({
                error: "Invalid URL format.",
                receivedUrl: mediaUrl
            });
        }

        const sanitizedUrl = sanitizeUrl(validatedUrl);
        const filename = sanitizedUrl.split("/").pop() || "media";
        const mimeType = getMimeType(sanitizedUrl, forceAudio);
        const isAudio = forceAudio || mimeType.startsWith("audio");
        const MediaTag = isAudio ? "audio" : "video";

        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Open Graph Metadata -->
        <meta property="og:type" content="${isAudio ? "music.song" : "video.other"}">
        <meta property="og:url" content="${sanitizedUrl}">
        <meta id="og-width" property="og:video:width" content="">
        <meta id="og-height" property="og:video:height" content="">
        <meta property="og:video:url" content="${sanitizedUrl}">
        <meta property="og:video:secure_url" content="${sanitizedUrl}">
        <meta property="og:video:type" content="${mimeType}">
        
        <!-- Twitter Card Metadata -->
        <meta name="twitter:card" content="${isAudio ? "audio" : "player"}">
        <meta name="twitter:player:stream" content="${sanitizedUrl}">
        <meta name="twitter:player" content="${sanitizedUrl}">
        <meta id="twitter-width" name="twitter:player:width" content="">
        <meta id="twitter-height" name="twitter:player:height" content="">
        
        <title>${isAudio ? "Audio" : "Video"} Player - ${filename}</title>
        <style>
          body { 
            margin: 0; 
            background: black; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
          }
          ${MediaTag} { 
            max-width: 100%; 
            max-height: 100vh; 
          }
        </style>
      </head>
      <body>
        <${MediaTag} 
          id="media-player" 
          controls 
          autoplay 
          style="display:none;"
        >
          <source src="${sanitizedUrl}" type="${mimeType}" />
          Your browser does not support media playback.
        </${MediaTag}>

        <script>
          const mediaPlayer = document.getElementById('media-player');
          
          mediaPlayer.addEventListener('loadedmetadata', function() {
            // Show the media player
            mediaPlayer.style.display = 'block';
            
            // Dynamic resolution detection
            let width, height;
            if (mediaPlayer.videoWidth && mediaPlayer.videoHeight) {
              width = mediaPlayer.videoWidth;
              height = mediaPlayer.videoHeight;
            } else {
              // Fallback to standard HD if detection fails
              width = 1920;
              height = 1080;
            }

            // Update Twitter Card metadata dynamically
            document.getElementById('twitter-width').setAttribute('content', width.toString());
            document.getElementById('twitter-height').setAttribute('content', height.toString());

            // Update Open Graph metadata dynamically
            document.getElementById('og-width').setAttribute('content', width.toString());
            document.getElementById('og-height').setAttribute('content', height.toString());

            // Optional: Additional logging or tracking
            console.log('Detected Resolution:', width + 'x' + height);
          });

          // Error handling
          mediaPlayer.addEventListener('error', function(e) {
            console.error('Media load error:', e);
            // Fallback metadata
            const fallbackWidth = '1920';
            const fallbackHeight = '1080';

            document.getElementById('twitter-width').setAttribute('content', fallbackWidth);
            document.getElementById('twitter-height').setAttribute('content', fallbackHeight);
            document.getElementById('og-width').setAttribute('content', fallbackWidth);
            document.getElementById('og-height').setAttribute('content', fallbackHeight);
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
