// utils/validation.js
export const VALID_EXTENSIONS = [
    ".mp4", ".webm", ".mov", ".flv", ".wmv", 
    ".avi", ".mkv", ".mpeg", ".mpg", ".3gp", 
    ".mp3", ".wav", ".ogg"
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

export function isValidUrl(string) {
  try {
    // Ensure proper protocol format
    let urlToTest = string;
    if (urlToTest.startsWith('http:/') && !urlToTest.startsWith('http://')) {
      urlToTest = urlToTest.replace('http:/', 'http://');
    }
    if (urlToTest.startsWith('https:/') && !urlToTest.startsWith('https://')) {
      urlToTest = urlToTest.replace('https:/', 'https://');
    }
    
    const url = new URL(urlToTest);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (err) {
    console.error('URL validation error:', err);
    return false;
  }
}

// Keep only this version of hasValidProtocol
export function hasValidProtocol(url) {
    return ALLOWED_PROTOCOLS.some(protocol => url.toLowerCase().startsWith(protocol));
}

export function hasValidExtension(url) {
    return VALID_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext));
}

export function sanitizeUrl(url) {
    return url.replace(/[<>"']/g, "");
}

export function getMimeType(url) {
    const extension = url.split(".").pop().toLowerCase();
    return MIME_TYPES[extension] || "video/webm";
}
