export const VALID_EXTENSIONS = [
    ".mp4",
    ".webm",
    ".mov",
    ".flv",
    ".wmv",
    ".avi",
    ".mkv",
    ".mpeg",
    ".mpg",
    ".3gp",
    ".mp3",
    ".wav",
    ".ogg",
    ".flac"
];
export const ALLOWED_PROTOCOLS = ["https://", "http://"];

export function isValidUrl(url) {
    // Add protocol if missing
    if (!url.match(/^https?:\/\//)) {
        url = `https://${url}`;
    }

    try {
        new URL(url);
        return url;
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

export function getMimeType(url, forceAudio = false) {
    const extension = url.split(".").pop().toLowerCase();
    const mimeTypes = {
        mp4: forceAudio ? "audio/mp4" : "video/mp4",
        webm: forceAudio ? "audio/webm" : "video/webm",
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
        ogg: forceAudio ? "audio/ogg" : "video/ogg",
        flac: "audio/flac",
        mp3: "audio/mpeg"
    };
    return mimeTypes[extension] || (forceAudio ? "audio/mpeg" : "application/octet-stream");
}
