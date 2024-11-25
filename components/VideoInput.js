import { useState } from "react";
import { ClipboardIcon } from "lucide-react";
import { siteUrl } from "@/utils/config";

export default function VideoInput() {
    const [videoUrl, setVideoUrl] = useState("");
    const [embedUrl, setEmbedUrl] = useState(siteUrl);
    const [copyText, setCopyText] = useState("Click to copy");
    const [hasError, setHasError] = useState(false);
    const [isAudio, setIsAudio] = useState(false);

    const updateLink = (url, forceAudio = false) => {
        try {
            if (url) {
                const decodedUrl = decodeURIComponent(url);

                let fixedUrl = decodedUrl;
                if (fixedUrl.startsWith("http:/") && !fixedUrl.startsWith("http://")) {
                    fixedUrl = fixedUrl.replace("http:/", "http://");
                }
                if (fixedUrl.startsWith("https:/") && !fixedUrl.startsWith("https://")) {
                    fixedUrl = fixedUrl.replace("https:/", "https://");
                }

                new URL(fixedUrl);

                setVideoUrl(fixedUrl);

                const embedUrlWithParams = new URL(`${siteUrl}/${decodeURIComponent(fixedUrl)}`);
                if (forceAudio) {
                    embedUrlWithParams.searchParams.set("a", "audio");
                }

                setEmbedUrl(embedUrlWithParams.toString());
                setIsAudio(forceAudio);
                setHasError(false);
            } else {
                setEmbedUrl(siteUrl);
                setHasError(false);
            }
        } catch (e) {
            setHasError(true);
            setEmbedUrl(siteUrl);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(embedUrl);
            setCopyText("Copied!");
            setTimeout(() => setCopyText("Click to copy"), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            alert("Failed to copy to clipboard");
        }
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            updateLink(text);
        } catch (err) {
            console.error("Failed to paste:", err);
            alert("Failed to paste from clipboard");
        }
    };

    return (
        <div className="text-center space-y-6 p-4 max-w-2xl w-full">
            <div className="relative w-full max-w-xl mx-auto">
                <input
                    type="url"
                    value={videoUrl}
                    onChange={e => updateLink(e.target.value)}
                    placeholder="Enter direct video link (MP4, WebM, MOV, etc.)"
                    className={`w-full px-4 py-2 bg-gray-800 border rounded-full text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500
                    transition-all duration-200 ${hasError ? "border-red-500" : "border-gray-600"}`}
                    autoComplete="off"
                    spellCheck="false"
                />
                <button
                    onClick={pasteFromClipboard}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                    <ClipboardIcon className="w-5 h-5" />
                </button>
            </div>

            {hasError && <p className="text-red-500">Invalid URL format.</p>}

            <div className="space-y-2">
                <p
                    onClick={copyToClipboard}
                    className="cursor-pointer text-gray-500 hover:text-gray-300 transition-colors break-all"
                >
                    {embedUrl}
                </p>
                <p className="text-sm text-gray-600">{copyText}</p>
            </div>

            {/* Improved Audio Force Toggle */}
            <div className="flex items-center justify-center space-x-4">
                <label htmlFor="forceAudio" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="forceAudio"
                            checked={isAudio}
                            onChange={e => updateLink(videoUrl, e.target.checked)}
                            className="sr-only"
                        />
                        <div className="block w-10 h-6 bg-gray-600 rounded-full"></div>
                        <div
                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                                isAudio ? "translate-x-4" : ""
                            }`}
                        ></div>
                    </div>
                    <span className="ml-3 text-gray-400">Force Audio Playback</span>
                </label>
            </div>
        </div>
    );
}
