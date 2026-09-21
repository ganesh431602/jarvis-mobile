const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
  "text/plain",
]);

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const validateFileUpload = (
  contentType: string,
  sizeBytes: number,
): void => {
  if (!ALLOWED_UPLOAD_TYPES.has(contentType.toLowerCase())) {
    throw new Error("Unsupported file type.");
  }

  if (!Number.isInteger(sizeBytes) || sizeBytes < 0 || sizeBytes > MAX_UPLOAD_BYTES) {
    throw new Error("File size exceeds the allowed limit.");
  }
};
