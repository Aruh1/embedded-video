import React, { useRef } from "react";

export function MediaPlayer({ url, ifType, ifAudio = false }) {
    const MediaTag = ifAudio ? "audio" : "video";
    const mediaRef = useRef(null);

    return (
        <>
            <style>{`
                body {
                    margin: 0;
                    background-color: black;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    overflow: hidden;
                }
                video,
                audio {
                    max-width: 100vw;
                    max-height: 100vh;
                    outline: none;
                }
                .fallback-message {
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
            `}</style>
            <MediaTag
                ref={mediaRef}
                controls
                autoPlay
                className="max-w-full max-h-full"
                onError={e => {
                    console.error("Media playback error:", e);
                }}
            >
                <source src={url} type={ifType} />
                <p className="fallback-message">Your browser does not support playback.</p>
            </MediaTag>
        </>
    );
}

export default MediaPlayer;
