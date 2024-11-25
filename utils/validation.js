export const VALID_EXTENSIONS = [
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

export const ALLOWED_PROTOCOLS = ["https://", "http://"];

export const MIME_TYPES = {
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

export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function hasValidExtension(url) {
    return VALID_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext));
}

export function hasValidProtocol(url) {
    return ALLOWED_PROTOCOLS.some(protocol => url.toLowerCase().startsWith(protocol));
}

export function sanitizeUrl(url) {
    return url.replace(/[<>"']/g, "");
}

export function getMimeType(url) {
    const extension = url.split(".").pop().toLowerCase();
    return MIME_TYPES[extension] || "application/octet-stream";
}
