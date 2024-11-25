import { getMimeType } from "@/utils/validation";

export default function MediaPlayer({ mediaUrl, forceAudio = false }) {
    if (!mediaUrl) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <p>No media URL provided.</p>
            </div>
        );
    }

    const filename = mediaUrl.split("/").pop();
    const mimeType = getMimeType(filename);
    const isAudio = forceAudio || mimeType.startsWith("audio");

    return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            {isAudio ? (
                <audio controls autoPlay className="max-w-full">
                    <source src={mediaUrl} type={mimeType} />
                    Your browser does not support audio playback.
                </audio>
            ) : (
                <video controls autoPlay className="max-w-full max-h-screen">
                    <source src={mediaUrl} type={mimeType} />
                    Your browser does not support video playback.
                </video>
            )}
        </div>
    );
}
