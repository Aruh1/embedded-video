import { useState } from "react";
import { ClipboardIcon, ImageIcon, UploadIcon } from "lucide-react";
import { siteUrl } from "@/utils/config";
import PreviewMedia from "./PreviewMedia";
import Footer from "./Footer";
import { isValidUrl, hasValidExtension, sanitizeUrl, getMimeType } from "@/utils/validation";

export default function VideoInput() {
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [embedUrl, setEmbedUrl] = useState(siteUrl);
    const [copyText, setCopyText] = useState("Copy Embed Link");
    const [isAudio, setIsAudio] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Generates the embed URL
    const generateEmbedUrl = (video, thumbnail, forceAudio) => {
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

        if (params.length) url += `?${params.join("&")}`;

        return url;
    };

    // Updates parameters and embed URL
    const updateParameters = (newVideoUrl, newThumbnailUrl = thumbnailUrl, newIsAudio = isAudio) => {
        const updatedEmbedUrl = generateEmbedUrl(newVideoUrl, newThumbnailUrl, newIsAudio);
        setVideoUrl(newVideoUrl);
        setThumbnailUrl(newThumbnailUrl);
        setIsAudio(newIsAudio);
        setEmbedUrl(updatedEmbedUrl);
    };

    // Copies embed URL to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(embedUrl);
            setCopyText("Copied!");
            setTimeout(() => setCopyText("Copy Embed Link"), 2000);
        } catch {
            alert("Failed to copy embed link.");
        }
    };

    // Pastes video URL from clipboard
    const pasteFromClipboard = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            updateParameters(clipboardText);
        } catch {
            alert("Failed to paste URL.");
        }
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;

        console.log("File details:", {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        });

        // Validate file size
        const maxSize = 200 * 1024 * 1024; // 200MB
        if (file.size > maxSize) {
            console.error("File size too large");
            alert("File size too large (max 200MB)");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("reqtype", "fileupload");
            formData.append("userhash", process.env.NEXT_PUBLIC_CATBOX_USER_HASH || "");
            formData.append("fileToUpload", file);

            const response = await fetch("https://cat.pololer.web.id/user/api.php", {
                method: "POST",
                body: formData
            });

            const responseText = await response.text();

            if (!response.ok || !responseText.startsWith("https://")) {
                throw new Error(responseText || `Upload failed for ${type}`);
            }

            const uploadedUrl = responseText.trim();

            // Update URL based on upload type
            if (type === "video") {
                updateParameters(uploadedUrl, thumbnailUrl, isAudio);
            } else if (type === "thumbnail") {
                updateParameters(videoUrl, uploadedUrl, isAudio);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message || `Failed to upload ${type} file`);
        } finally {
            setIsUploading(false);
        }
    };

    const LoadingSpinner = () => (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-white" />
    );

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
            {/* Video URL Input */}
            <div className="relative">
                <input
                    type="url"
                    value={videoUrl}
                    onChange={e => updateParameters(e.target.value, thumbnailUrl, isAudio)}
                    placeholder="Enter direct media URL (MP4, WebM, MOV, etc)"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    placeholder-gray-500 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                    <button onClick={pasteFromClipboard} className="text-gray-400 hover:text-white transition">
                        <ClipboardIcon className="w-5 h-5" />
                    </button>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={e => handleFileUpload(e.target.files[0], "video")}
                            disabled={isUploading}
                        />
                        {isUploading ? (
                            <LoadingSpinner />
                        ) : (
                            <UploadIcon className="w-5 h-5 text-gray-400 hover:text-white transition" />
                        )}
                    </label>
                </div>
            </div>

            {/* Thumbnail URL Input */}
            <div className="relative">
                <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={e => updateParameters(videoUrl, e.target.value, isAudio)}
                    placeholder="Optional: Thumbnail URL"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    placeholder-gray-500 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={e => handleFileUpload(e.target.files[0], "thumbnail")}
                            disabled={isUploading}
                        />
                        {isUploading ? (
                            <LoadingSpinner />
                        ) : (
                            <UploadIcon className="w-5 h-5 text-gray-400 hover:text-white transition" />
                        )}
                    </label>
                </div>
            </div>

            {/* Embed Link Section */}
            <div className="bg-gray-900 p-4 rounded-lg">
                <div
                    onClick={copyToClipboard}
                    className="break-all text-sm text-gray-300 cursor-pointer 
                    hover:text-white transition-colors p-2 bg-gray-800 rounded"
                >
                    {embedUrl}
                </div>
                <div className="text-center mt-2">
                    <span className="text-xs text-gray-500">{copyText}</span>
                </div>
            </div>

            {/* Audio Toggle */}
            <div className="flex justify-center items-center space-x-3">
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
                    <span className="ml-3 text-gray-400">Force Audio Playback</span>
                </label>
            </div>

            {/* Media Preview */}
            <PreviewMedia url={videoUrl} forceAudio={isAudio} thumbnailUrl={thumbnailUrl} />
            <Footer />
        </div>
    );
}
