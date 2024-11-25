import { useState } from "react";
import { ClipboardIcon } from "lucide-react";
import { siteUrl } from "@/utils/config";

export default function VideoInput() {
    const [videoUrl, setVideoUrl] = useState("");
    const [embedUrl, setEmbedUrl] = useState(siteUrl);
    const [copyText, setCopyText] = useState("Click to copy");
    const [hasError, setHasError] = useState(false);

    const updateLink = url => {
        setVideoUrl(url);
        try {
            if (url) {
                new URL(url);
                setEmbedUrl(`${siteUrl}/${encodeURIComponent(url)}`);
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
            setVideoUrl(text);
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

            <div className="space-y-2">
                <p
                    onClick={copyToClipboard}
                    className="cursor-pointer text-gray-500 hover:text-gray-300 transition-colors break-all"
                >
                    {embedUrl}
                </p>
                <p className="text-sm text-gray-600">{copyText}</p>
            </div>
        </div>
    );
}
