import { useState } from "react";
import { ClipboardIcon, Github, Coffee, Icon } from "lucide-react";
import { siteUrl } from "@/utils/config";
import { mugTeabag } from "@lucide/lab";
import { PreviewMedia } from "./PreviewMedia.js";

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

    const TooltipContent = ({ text }) => (
        <div
            className="absolute left-1/2 ml-5 top-1/2 -translate-y-1/2 z-50
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transform -translate-x-2 group-hover:translate-x-0
            transition-all duration-300 ease-out"
        >
            <div className="relative bg-gray-800 rounded-md px-2 py-1">
                <span className="text-xs text-white whitespace-nowrap">{text}</span>
                <div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 
                    border-t-[6px] border-r-[6px] border-b-[6px] 
                    border-t-transparent border-r-gray-800 border-b-transparent"
                ></div>
            </div>
        </div>
    );

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

            {/* Improved Preview Media */}
            <div className="space-y-2">
                <PreviewMedia url={videoUrl} forceAudio={isAudio} />
            </div>

            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 animate-fadeIn">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm gap-4">
                    <div className="flex items-center space-x-4 animate-slideInLeft">
                        <span className="hover:text-gray-200 transition-colors duration-300">
                            © {new Date().getFullYear()} ‧ pololer@Yuramedia Link. All rights reserved. Powered by
                        </span>
                        <a
                            href="https://vercel.com/"
                            rel="noreferrer noopener"
                            className="hover:text-gray-200 transition-colors duration-300"
                        >
                            <svg
                                className="h-4 w-16"
                                viewBox="0 0 283 64"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H85.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                        <a
                            href="https://status.pololer.web.id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-200 transition-colors duration-300"
                        >
                            <img
                                src="https://uptime.betterstack.com/status-badges/v1/monitor/1ogdv.svg"
                                alt="Uptime Status"
                                className="h-4"
                            />
                        </a>
                    </div>
                    <div className="flex items-center space-x-6 animate-slideInRight">
                        <div className="group relative">
                            <a
                                href="https://ko-fi.com/pololer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 hover:animate-bounce"
                                aria-label="Support on Ko-fi"
                            >
                                <Coffee className="w-5 h-5" />
                            </a>
                            <TooltipContent text="Support on Ko-fi" />
                        </div>

                        <div className="group relative">
                            <a
                                href="https://trakteer.id/luminiatus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-orange-400 transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 hover:animate-bounce"
                                aria-label="Support on Trakteer"
                            >
                                <Icon iconNode={mugTeabag} className="w-5 h-5" />
                            </a>
                            <TooltipContent text="Dukung Saya di Trakteer" />
                        </div>

                        <div className="group relative">
                            <a
                                href="https://github.com/Aruh1/embedded-video"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gray-200 transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 hover:animate-bounce"
                                aria-label="View source on GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <TooltipContent text="View on GitHub" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
