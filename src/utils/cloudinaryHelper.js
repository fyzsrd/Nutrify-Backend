import cloudinary from "./cloudinary.js";

/**
 * Delete image from Cloudinary safely
 * @param {string} publicId - Cloudinary public_id of the image
 */
export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return; // nothing to delete
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Failed to delete image from Cloudinary:", error.message);
  }
};