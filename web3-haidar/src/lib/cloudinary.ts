import { v2 as cloudinary } from "cloudinary";

// The Cloudinary SDK auto-reads a single `CLOUDINARY_URL` env var
// (format: cloudinary://<api_key>:<api_secret>@<cloud_name>) if present —
// this is what our deployment actually has configured. We still support
// three separate CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET vars as a
// fallback so local development isn't forced into the combined-URL format.
// Previously this file only read the three separate vars, which were
// never set — CLOUDINARY_URL was configured instead — so every upload
// call was silently authenticating with `undefined` credentials.
if (process.env.CLOUDINARY_URL) {
  // cloudinary.config() with no arguments makes the SDK parse
  // process.env.CLOUDINARY_URL itself.
  cloudinary.config({ secure: true });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const ALLOWED_DOC_TYPES = new Set([
  "application/pdf",
]);

export class UploadValidationError extends Error {}

export async function uploadImage(file: File, folder: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new UploadValidationError(
      `Unsupported image type: ${file.type || "unknown"}. Use PNG, JPEG, WEBP, or GIF.`
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError("Image exceeds the 8MB size limit.");
  }
  return uploadBuffer(await fileToBuffer(file), folder, "image", file.name);
}

export async function uploadDocument(file: File, folder: string) {
  if (!ALLOWED_DOC_TYPES.has(file.type)) {
    throw new UploadValidationError(
      `Unsupported file type: ${file.type || "unknown"}. Only PDF files are accepted.`
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new UploadValidationError("File exceeds the 15MB size limit.");
  }
  return uploadBuffer(await fileToBuffer(file), folder, "raw", file.name);
}

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function uploadBuffer(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw",
  filename: string
): Promise<{ url: string; publicId: string; bytes: number }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: filename,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
        });
      }
    );
    stream.end(buffer);
  });
}

const ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
]);

// Contact-form attachments accept a broader set of types than project
// media (per spec: images, PDFs, or docx). Images go through Cloudinary's
// image pipeline; everything else uploads as a raw asset.
export async function uploadAttachment(file: File, folder: string) {
  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
    throw new UploadValidationError(
      "Unsupported attachment type. Use PNG, JPEG, PDF, or DOCX."
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new UploadValidationError("Attachment exceeds the 15MB size limit.");
  }
  const resourceType = file.type.startsWith("image/") ? "image" : "raw";
  return uploadBuffer(await fileToBuffer(file), folder, resourceType, file.name);
}

export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "raw" = "image"
) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    // Non-fatal: the DB record deletion should still succeed even if the
    // remote Cloudinary asset fails to delete (e.g. transient network
    // issue). Worst case is an orphaned file in Cloudinary storage, which
    // is a minor cleanup task, not a correctness or security issue.
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
  }
}
