import { v2 as cloudinary } from "cloudinary";

// Tabbatar da Cloudinary configuration
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

// Mun saita 5MB kamar yadda kake so
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; 
const MAX_FILE_BYTES = 15 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);

export class UploadValidationError extends Error {}

export async function uploadImage(file: File, folder: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new UploadValidationError(`Unsupported image type: ${file.type}. Use PNG, JPEG, WEBP, or GIF.`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError("Hoton ya wuce 5MB limit.");
  }
  return uploadBuffer(await fileToBuffer(file), folder, "image", file.name);
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
        if (error || !result) {
          console.error("Cloudinary Upload Error:", error); // Wannan zai nuna matsalar a Console
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id, bytes: result.bytes });
      }
    );
    stream.end(buffer);
  });
}
