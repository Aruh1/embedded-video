import { useState } from "react";
import { UploadIcon } from "lucide-react";

export default function FileUpload({ onUpload, type = "video", disabled = false, LoadingSpinner = null }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async file => {
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
            formData.append("userhash", "");
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

            // Call the provided onUpload callback
            onUpload(uploadedUrl, type);
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message || `Failed to upload ${type} file`);
        } finally {
            setIsUploading(false);
        }
    };

    // Default loading spinner if not provided
    const DefaultLoadingSpinner = () => (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-white" />
    );

    const AcceptedFileTypes = {
        video: "video/*",
        thumbnail: "image/*"
    };

    return (
        <label className="cursor-pointer">
            <input
                type="file"
                className="hidden"
                accept={AcceptedFileTypes[type]}
                onChange={e => handleFileUpload(e.target.files[0])}
                disabled={disabled || isUploading}
            />
            {isUploading ? (
                LoadingSpinner || <DefaultLoadingSpinner />
            ) : (
                <UploadIcon className="w-5 h-5 text-gray-400 hover:text-white transition" />
            )}
        </label>
    );
}
