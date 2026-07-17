import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/png", "image/jpeg", "image/webp", "application/pdf", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export class UploadValidationError extends Error {}

export async function uploadImage(file: File, folder: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new UploadValidationError("Unsupported image type.");
  if (file.size > MAX_IMAGE_BYTES) throw new UploadValidationError("Image exceeds 5MB.");
  return uploadBuffer(await fileToBuffer(file), folder, "image", file.name);
}

export async function uploadDocument(file: File, folder: string) {
  if (!ALLOWED_DOC_TYPES.has(file.type)) throw new UploadValidationError("Only PDF accepted.");
  if (file.size > MAX_FILE_BYTES) throw new UploadValidationError("File exceeds 15MB.");
  return uploadBuffer(await fileToBuffer(file), folder, "raw", file.name);
}

export async function uploadAttachment(file: File, folder: string) {
  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) throw new UploadValidationError("Unsupported attachment type.");
  if (file.size > MAX_FILE_BYTES) throw new UploadValidationError("File exceeds 15MB.");
  const resourceType = file.type.startsWith("image/") ? "image" : "raw";
  return uploadBuffer(await fileToBuffer(file), folder, resourceType, file.name);
}

export async function deleteAsset(publicId: string, resourceType: "image" | "raw" = "image") {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Delete failed:", err);
  }
}

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function uploadBuffer(buffer: Buffer, folder: string, resourceType: "image" | "raw", filename: string) {
  return new Promise<{ url: string; publicId: string; bytes: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, use_filename: true, unique_filename: true, filename_override: filename },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Cloudinary upload failed"));
        else resolve({ url: result.secure_url, publicId: result.public_id, bytes: result.bytes });
      }
    );
    stream.end(buffer);
  });
}
