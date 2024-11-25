// Constants
const VALID_EXTENSIONS = [
    ".mp4", // MPEG-4
    ".webm", // WebM
    ".mov", // QuickTime Movie
    ".flv", // Flash Video
    ".wmv", // Windows Media Video
    ".avi", // Audio Video Interleave
    ".mkv", // Matroska Video
    ".mpeg", // MPEG Video
    ".mpg", // MPEG Video (alternative extension)
    ".3gp", // 3GPP Multimedia
    ".mp3",
    ".wav",
    ".ogg"
];
const ALLOWED_PROTOCOLS = ["https://", "http://"];

// Function to get MIME type based on file extension
function getMimeType(url) {
    const extension = url.split(".").pop().toLowerCase();
    const mimeTypes = {
        mp4: "video/mp4",
        webm: "video/webm",
        mov: "video/quicktime",
        flv: "video/x-flv",
        wmv: "video/x-ms-wmv",
        avi: "video/x-msvideo",
        mkv: "video/x-matroska",
        mpeg: "video/mpeg",
        mpg: "video/mpeg",
        "3gp": "video/3gpp",
        mp3: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg"
    };
    return mimeTypes[extension] || "application/octet-stream";
}

// Utility functions
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function hasValidExtension(url) {
    return VALID_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext));
}

function hasValidProtocol(url) {
    return ALLOWED_PROTOCOLS.some(protocol => url.toLowerCase().startsWith(protocol));
}

function sanitizeUrl(url) {
    return url.replace(/[<>"']/g, ""); // Prevent XSS vulnerabilities
}

// Generate HTML for root page
const getRootHTML = () => `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Embedded Video</title>
        <meta name="description" content="Embed large video files on Discord">
        <meta name="theme-color" content="#FFFFFF">
        <link rel="shortcut icon" type="image/x-icon" href="https://ptpimg.me/animated_favicon.gif"/>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            function updateLink() {
                const input = document.getElementById("video-input");
                const linkDisplay = document.getElementById("video-link");
                const videoUrl = input.value.trim();
                
                try {
                    if (videoUrl) {
                        new URL(videoUrl);
                        linkDisplay.textContent = \`https://v.pololer.web.id/\${decodeURIComponent(videoUrl)}\`;
                        input.classList.remove('border-red-500');
                    } else {
                        linkDisplay.textContent = 'https://v.pololer.web.id/';
                    }
                } catch (e) {
                    input.classList.add('border-red-500');
                    linkDisplay.textContent = 'https://v.pololer.web.id/';
                }
            }
    
            function copyText() {
                const text = document.getElementById("video-link").textContent;
                navigator.clipboard.writeText(text)
                    .then(() => {
                        const copyButton = document.getElementById("copy-notification");
                        copyButton.textContent = "Copied!";
                        setTimeout(() => {
                            copyButton.textContent = "Click to copy";
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy:', err);
                        alert("Failed to copy to clipboard");
                    });
            }
    
            async function pasteText() {
                const input = document.getElementById("video-input");
                try {
                    const clipboardText = await navigator.clipboard.readText();
                    input.value = clipboardText;
                    updateLink();
                } catch (err) {
                    console.error("Failed to paste:", err);
                    alert("Failed to paste from clipboard");
                }
            }
        </script>
    </head>
    <body class="bg-black flex items-center justify-center min-h-screen text-white">
        <div class="text-center space-y-6 p-4 max-w-2xl w-full">
            <svg class="mx-auto w-16 h-16 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm2.5 5v7h11V6h-11zM13 2.5V5H3V2.5h10z"/>
            </svg>
            <h1 class="text-2xl font-semibold">Embedded Video</h1>
            <p class="text-gray-400">A service to embed files bigger than 50MB on Discord.</p>
            
            <div class="relative w-full max-w-xl mx-auto">
                <input 
                    type="url" 
                    id="video-input" 
                    oninput="updateLink()" 
                    placeholder="Enter direct video link (MP4, WebM, MOV, etc.)"
                    class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-white 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500
                           transition-all duration-200"
                    autocomplete="off"
                    spellcheck="false"
                >
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                    <svg onclick="pasteText()" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" 
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 2h-4a2 2 0 0 0-4 0H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 4h2v2h6V4h2v14H7V4zm5 4h-2v2H8v2h2v2h2v-2h2v-2h-2V8z"/>
                    </svg>
                </span>
            </div>
            
            <div class="space-y-2">
                <p id="video-link" 
                   onclick="copyText()" 
                   class="cursor-pointer text-gray-500 hover:text-gray-300 transition-colors break-all">
                   https://v.pololer.web.id/
                </p>
                <p id="copy-notification" class="text-sm text-gray-600">Click to copy</p>
            </div>
        </div>
    </body>
    </html>
  `;

// Generate HTML for media player
const getMediaHTML = (mediaUrl, forceAudio = false) => {
    const filename = mediaUrl.split("/").pop();
    const mimeType = getMimeType(mediaUrl);
    const isAudio = forceAudio || mimeType.startsWith("audio");

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:type" content="video.other">
    <meta property="og:video:url" content="${mediaUrl}">
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
      ${isAudio ? "audio" : "video"} {
        max-width: 100vw;
        max-height: 100vh;
      }
    </style>
  </head>
  <body>
    ${
        isAudio
            ? `
      <audio controls autoplay>
        <source src="${mediaUrl}" type="${mimeType}">
        Your browser does not support audio playback.
      </audio>
    `
            : `
      <video controls autoplay>
        <source src="${mediaUrl}" type="${mimeType}">
        Your browser does not support video playback.
      </video>
    `
    }
  </body>
  </html>
  `;
};

// Request handler
async function handleRequest(request) {
    try {
        const url = new URL(request.url);
        const mediaUrl = decodeURIComponent(url.pathname.slice(1));
        const forceAudio = url.searchParams.get("a") === "audio";

        // If no media URL, return the root HTML page
        if (!mediaUrl) {
            return new Response(getRootHTML(), {
                status: 200,
                headers: { "Content-Type": "text/html" }
            });
        }

        // Validate the media URL
        if (!isValidUrl(mediaUrl)) {
            return new Response("Invalid URL format.", { status: 400 });
        }

        if (!hasValidProtocol(mediaUrl)) {
            return new Response("URL must start with https:// or http://", { status: 400 });
        }

        if (!hasValidExtension(mediaUrl)) {
            return new Response(`Invalid file type. Supported extensions: ${VALID_EXTENSIONS.join(", ")}`, {
                status: 400
            });
        }

        // Sanitize URL to avoid XSS vulnerabilities
        const sanitizedUrl = sanitizeUrl(mediaUrl);

        // Generate and return the media player page
        return new Response(getMediaHTML(sanitizedUrl, forceAudio), {
            status: 200,
            headers: { "Content-Type": "text/html" }
        });
    } catch (err) {
        console.error("Error handling request:", err);
        return new Response("Internal server error", { status: 500 });
    }
}

// Event listener for incoming requests
addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
});
