import { v2 as cloudinary } from "cloudinary";

/**
 * Env-guarded Cloudinary config. Returns the configured SDK, or null when
 * credentials are absent (uploads stay in demo mode).
 */
export function getCloudinary() {
  const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) return null;
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return cloudinary;
}

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
