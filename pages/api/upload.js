import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { hasValidExtension, getMimeType } from "@/utils/validation";

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    console.log("Received upload request");
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const uploadDir = path.join(process.cwd(), 'tmp');
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
        console.error("Error creating upload directory:", err);
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 200 * 1024 * 1024, // 200MB
        filename: (name, ext, path, form) => {
            const newFilename = `${Date.now()}-${name}${ext}`;
            console.log("Generated filename:", newFilename);
            return newFilename;
        }
    });

    try {
        const parsedForm = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error("Form parse error:", err);
                    reject(err);
                } else {
                    console.log("Parse successful. Files:", JSON.stringify(files, null, 2));
                    resolve({ fields, files });
                }
            });
        });

        const file = parsedForm.files.file[0] || parsedForm.files.file;

        if (!file) {
            console.error("No file uploaded");
            return res.status(400).json({ error: "No file uploaded" });
        }

        if (!hasValidExtension(file.originalFilename)) {
            console.error("Invalid file extension:", file.originalFilename);
            return res.status(400).json({ error: "Invalid file extension" });
        }

        const mimeType = getMimeType(file.originalFilename);
        console.log("Detected MIME type:", mimeType);

        // Use native fetch and FormData
        const formData = new FormData();
        formData.append("reqtype", "fileupload");
        formData.append("userhash", process.env.CATBOX_USER_HASH || "");

        // Read file as Buffer and append
        const fileBuffer = await fs.readFile(file.filepath);
        formData.append("fileToUpload", new File([fileBuffer], file.originalFilename, { type: mimeType }));

        const response = await fetch("https://cat.pololer.web.id/user/api.php", {
            method: "POST",
            body: formData
        });

        const responseText = await response.text();
        console.log("Catbox response status:", response.status);
        console.log("Catbox response text:", responseText);

        if (!response.ok || !responseText.startsWith("https://")) {
            console.error("Catbox upload error:", responseText);
            return res.status(500).json({
                error: "Upload failed",
                details: responseText
            });
        }

        // Clean up uploaded file
        await fs.unlink(file.filepath);

        const trimmedUrl = responseText.trim();
        console.log("Upload successful:", trimmedUrl);
        return res.status(200).json({ url: trimmedUrl });
    } catch (error) {
        console.error("Full upload error:", error);
        return res.status(500).json({
            error: "Server upload error",
            details: error.toString()
        });
    }
}
