import { isValidUrl, hasValidProtocol, hasValidExtension, sanitizeUrl, getMimeType } from '@/utils/validation';

export default function handler(req, res) {
  try {
    // Mendapatkan mediaUrl yang sudah di-encode dalam query string
    let { mediaUrl } = req.query;

    // Mendecode seluruh URL yang diterima
    const decodedUrl = decodeURIComponent(mediaUrl); // decode URL secara keseluruhan

    // Lakukan validasi URL
    if (!isValidUrl(decodedUrl)) {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }

    if (!hasValidProtocol(decodedUrl)) {
      return res.status(400).json({ error: 'URL must start with https:// or http://' });
    }

    if (!hasValidExtension(decodedUrl)) {
      return res.status(400).json({ error: 'Invalid file type.' });
    }

    const sanitizedUrl = sanitizeUrl(decodedUrl);
    const filename = sanitizedUrl.split('/').pop();
    const mimeType = getMimeType(sanitizedUrl);
    const isAudio = mimeType.startsWith('audio');

    // Generate HTML response
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
        <title>${isAudio ? 'Audio' : 'Video'} Player - ${filename}</title>
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
        ${isAudio ? 
          `<audio controls autoplay>
            <source src="${sanitizedUrl}" type="${mimeType}">
            Your browser does not support audio playback.
           </audio>`
         : 
          `<video controls autoplay>
            <source src="${sanitizedUrl}" type="${mimeType}">
            Your browser does not support video playback.
           </video>`
        }
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
