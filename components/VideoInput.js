import React, { useState, useCallback, useMemo } from "react";
import { ClipboardIcon, ImageIcon } from "lucide-react";
import { siteUrl } from "@/utils/config";
import PreviewMedia from "./PreviewMedia";
import Footer from "./Footer";
import FileUpload from "./FileUpload";
import { isValidUrl, hasValidExtension, sanitizeUrl } from "@/utils/validation";

export default function VideoInput() {
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [embedUrl, setEmbedUrl] = useState(siteUrl);
    const [copyText, setCopyText] = useState("Copy Embed Link");
    const [isAudio, setIsAudio] = useState(false);

    // Memoized URL generation with useCallback for performance
    const generateEmbedUrl = useCallback((video, thumbnail, forceAudio) => {
        const sanitizedVideoUrl = sanitizeUrl(video);
        if (!isValidUrl(sanitizedVideoUrl) || !hasValidExtension(sanitizedVideoUrl)) {
            return "Invalid video URL. Please ensure it includes a valid extension and protocol.";
        }

        const sanitizedThumbnailUrl = thumbnail ? sanitizeUrl(thumbnail) : null;
        if (sanitizedThumbnailUrl && !isValidUrl(sanitizedThumbnailUrl)) {
            return "Invalid thumbnail URL. Ensure it starts with 'http://' or 'https://'.";
        }

        let url = `${siteUrl}/${sanitizedVideoUrl}`;
        const params = [];
        if (forceAudio) params.push("a=audio");
        if (sanitizedThumbnailUrl) params.push(`i=${sanitizedThumbnailUrl}`);

        return params.length ? `${url}?${params.join("&")}` : url;
    }, []);

    // Optimize parameter updates
    const updateParameters = useCallback(
        (newVideoUrl, newThumbnailUrl = thumbnailUrl, newIsAudio = isAudio) => {
            const updatedEmbedUrl = generateEmbedUrl(newVideoUrl, newThumbnailUrl, newIsAudio);
            setVideoUrl(newVideoUrl);
            setThumbnailUrl(newThumbnailUrl);
            setIsAudio(newIsAudio);
            setEmbedUrl(updatedEmbedUrl);
        },
        [generateEmbedUrl, thumbnailUrl]
    );

    // Clipboard interaction with error handling
    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(embedUrl);
            setCopyText("Copied!");
            setTimeout(() => setCopyText("Copy Embed Link"), 2000);
        } catch (error) {
            console.error("Clipboard copy failed:", error);
            alert("Failed to copy embed link.");
        }
    }, [embedUrl]);

    const pasteFromClipboard = useCallback(async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            updateParameters(clipboardText);
        } catch (error) {
            console.error("Clipboard paste failed:", error);
            alert("Failed to paste URL.");
        }
    }, [updateParameters]);

    // Memoized sections for better rendering performance
    const inputClassNames = useMemo(
        () => ({
            base:
                "w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white " +
                "focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                "placeholder-gray-500 transition-all duration-200",
            container: "relative space-y-4 sm:space-y-6"
        }),
        []
    );

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
            <div className={inputClassNames.container}>
                {/* Video URL Input */}
                <div className="relative">
                    <input
                        type="url"
                        value={videoUrl}
                        onChange={e => updateParameters(e.target.value)}
                        placeholder="Enter direct media URL (MP4, WebM, MOV, etc)"
                        className={inputClassNames.base}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                        <button
                            onClick={pasteFromClipboard}
                            className="text-gray-400 hover:text-white transition"
                            aria-label="Paste URL"
                        >
                            <ClipboardIcon className="w-5 h-5" />
                        </button>
                        <FileUpload type="video" onUpload={updateParameters} />
                    </div>
                </div>

                {/* Thumbnail URL Input */}
                <div className="relative">
                    <input
                        type="url"
                        value={thumbnailUrl}
                        onChange={e => updateParameters(videoUrl, e.target.value)}
                        placeholder="Optional: Thumbnail URL"
                        className={inputClassNames.base}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        <FileUpload type="thumbnail" onUpload={url => updateParameters(videoUrl, url)} />
                    </div>
                </div>
            </div>

            {/* Embed Link Section with Mobile Responsiveness */}
            <div className="bg-gray-900 p-4 rounded-lg break-words">
                <div
                    onClick={copyToClipboard}
                    className="text-sm text-gray-300 cursor-pointer 
                    hover:text-white transition-colors p-2 bg-gray-800 rounded max-w-full overflow-x-auto"
                >
                    {embedUrl}
                </div>
                <div className="text-center mt-2">
                    <span className="text-xs text-gray-500">{copyText}</span>
                </div>
            </div>

            {/* Audio Toggle with Responsive Design */}
            <div className="flex justify-center items-center space-x-3 flex-wrap">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isAudio}
                            onChange={e => updateParameters(videoUrl, thumbnailUrl, e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`w-10 h-6 ${isAudio ? "bg-blue-600" : "bg-gray-600"} rounded-full`}></div>
                        <div
                            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full 
                            transition ${isAudio ? "transform translate-x-4" : ""}`}
                        ></div>
                    </div>
                    <span className="ml-3 text-gray-400 text-sm sm:text-base">Force Audio Playback</span>
                </label>
            </div>

            {/* Media Preview */}
            <PreviewMedia url={videoUrl} forceAudio={isAudio} thumbnailUrl={thumbnailUrl} />
            <Footer />
        </div>
    );
}
