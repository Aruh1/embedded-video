import React, { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { isValidUrl, hasValidExtension, hasValidProtocol, sanitizeUrl, getMimeType } from "@/utils/validation";

export function PreviewMedia({ url, forceAudio = false, thumbnailUrl = "" }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const mediaRef = useRef(null);
    const [validatedThumbnailUrl, setValidatedThumbnailUrl] = useState("");

    // Memoized validation logic
    const urlValidation = useMemo(() => {
        return {
            validateUrl: inputUrl => {
                if (!inputUrl) return { valid: false, error: "" };

                const sanitizedUrl = sanitizeUrl(inputUrl);
                const validatedUrl = isValidUrl(sanitizedUrl);

                if (!validatedUrl) return { valid: false, error: "Invalid URL format" };
                if (!hasValidProtocol(validatedUrl))
                    return { valid: false, error: "Invalid protocol. Use http:// or https://" };
                if (!hasValidExtension(validatedUrl)) return { valid: false, error: "Unsupported file type" };

                return { valid: true, error: "" };
            },
            validateThumbnail: thumbUrl => {
                if (!thumbUrl) return "";

                const sanitizedUrl = sanitizeUrl(thumbUrl);
                const validatedUrl = isValidUrl(sanitizedUrl);

                return validatedUrl && hasValidProtocol(validatedUrl) ? sanitizedUrl : "";
            }
        };
    }, []);

    // URL Validation
    useEffect(() => {
        const { valid, error } = urlValidation.validateUrl(url);
        setIsValid(valid);
        setErrorMessage(error);
    }, [url, urlValidation]);

    // Thumbnail URL Validation
    useEffect(() => {
        const validatedUrl = urlValidation.validateThumbnail(thumbnailUrl);
        setValidatedThumbnailUrl(validatedUrl);
    }, [thumbnailUrl, urlValidation]);

    // Media type and error handling
    const mediaInfo = useMemo(() => {
        const mediaType = isValid ? getMimeType(url, forceAudio) : "";
        const isAudioMedia = mediaType.startsWith("audio");
        return {
            type: mediaType,
            Tag: isAudioMedia ? "audio" : "video"
        };
    }, [url, forceAudio, isValid]);

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

    // Render conditions
    if (!isValid && url) {
        return <div className="text-red-500 text-sm mt-2 text-center">{errorMessage}</div>;
    }

    if (!url) return null;

    const { Tag } = mediaInfo;

    return (
        <div className="w-full max-w-md mx-auto mt-2 responsive-media-container">
            <Tag
                ref={mediaRef}
                src={url}
                className="w-full rounded-lg shadow-md"
                preload="metadata"
                type={mediaInfo.type}
                controls
                poster={validatedThumbnailUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            {validatedThumbnailUrl && (
                <div className="mt-2 text-xs text-gray-500 text-center truncate">
                    Thumbnail: {validatedThumbnailUrl}
                </div>
            )}
        </div>
    );
}

// PropTypes and Default Props remain the same
PreviewMedia.propTypes = {
    url: PropTypes.string,
    forceAudio: PropTypes.bool,
    thumbnailUrl: PropTypes.string
};

PreviewMedia.defaultProps = {
    url: "",
    forceAudio: false,
    thumbnailUrl: ""
};

export default PreviewMedia;
