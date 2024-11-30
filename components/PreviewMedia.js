import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { isValidUrl, hasValidExtension, hasValidProtocol, sanitizeUrl, getMimeType } from "@/utils/validation";

export function PreviewMedia({ url, forceAudio = false, thumbnailUrl = "" }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const mediaRef = useRef(null);
    const [validatedThumbnailUrl, setValidatedThumbnailUrl] = useState("");

    // URL Validation for Video
    useEffect(() => {
        const validateUrl = () => {
            // Skip validation if URL is empty
            if (!url) {
                setIsValid(false);
                setErrorMessage("");
                return false;
            }

            // Sanitize and validate URL
            const sanitizedUrl = sanitizeUrl(url);
            const validatedUrl = isValidUrl(sanitizedUrl);

            if (!validatedUrl) {
                setIsValid(false);
                setErrorMessage("Invalid URL format");
                return false;
            }

            if (!hasValidProtocol(validatedUrl)) {
                setIsValid(false);
                setErrorMessage("Invalid protocol. Use http:// or https://");
                return false;
            }

            if (!hasValidExtension(validatedUrl)) {
                setIsValid(false);
                setErrorMessage("Unsupported file type");
                return false;
            }

            setIsValid(true);
            setErrorMessage("");
            return true;
        };

        validateUrl();
    }, [url]);

    // Thumbnail URL Validation
    useEffect(() => {
        const validateThumbnailUrl = () => {
            if (!thumbnailUrl) {
                setValidatedThumbnailUrl("");
                return;
            }

            try {
                const sanitizedUrl = sanitizeUrl(thumbnailUrl);
                const validatedUrl = isValidUrl(sanitizedUrl);

                if (validatedUrl && hasValidProtocol(validatedUrl)) {
                    setValidatedThumbnailUrl(sanitizedUrl);
                } else {
                    setValidatedThumbnailUrl("");
                }
            } catch {
                setValidatedThumbnailUrl("");
            }
        };

        validateThumbnailUrl();
    }, [thumbnailUrl]);

    // Determine media type
    const mediaType = isValid ? getMimeType(url, forceAudio) : "";
    const isAudioMedia = mediaType.startsWith("audio");
    const MediaTag = isAudioMedia ? "audio" : "video";

    useEffect(() => {
        const currentMedia = mediaRef.current;
        if (currentMedia) {
            const handleEnded = () => setIsPlaying(false);
            const handleError = () => {
                setErrorMessage("Error loading media");
                setIsValid(false);
            };

            currentMedia.addEventListener("ended", handleEnded);
            currentMedia.addEventListener("error", handleError);

            return () => {
                currentMedia.removeEventListener("ended", handleEnded);
                currentMedia.removeEventListener("error", handleError);
            };
        }
    }, [url]);

    if (!isValid && url) {
        return <div className="text-red-500 text-sm mt-2">{errorMessage}</div>;
    }

    if (!url) return null;

    return (
        <div className="w-full max-w-md mx-auto mt-2">
            <MediaTag
                ref={mediaRef}
                src={url}
                className="w-full"
                preload="metadata"
                type={mediaType}
                controls
                poster={validatedThumbnailUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            {validatedThumbnailUrl && (
                <div className="mt-2 text-sm text-gray-500 text-center">Thumbnail: {validatedThumbnailUrl}</div>
            )}
        </div>
    );
}

// PropTypes for type checking
PreviewMedia.propTypes = {
    url: PropTypes.string,
    forceAudio: PropTypes.bool,
    thumbnailUrl: PropTypes.string
};

// Default props
PreviewMedia.defaultProps = {
    url: "",
    forceAudio: false,
    thumbnailUrl: ""
};

export default PreviewMedia;
