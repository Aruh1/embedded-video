import React from "react";
import PropTypes from "prop-types";

const MediaPlayer = ({ src, type, filename = "media", autoPlay = true, controls = true }) => {
    const isAudio = type.startsWith("audio/");
    const MediaTag = isAudio ? "audio" : "video";

    return (
        <div className="media-player-container">
            <MediaTag controls={controls} autoPlay={autoPlay} className="max-w-full max-h-full">
                <source src={src} type={type} />
                Your browser does not support {isAudio ? "audio" : "video"} playback.
            </MediaTag>
        </div>
    );
};

MediaPlayer.propTypes = {
    src: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    filename: PropTypes.string,
    autoPlay: PropTypes.bool,
    controls: PropTypes.bool
};

export default MediaPlayer;
