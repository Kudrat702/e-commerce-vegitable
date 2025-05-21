import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

// Cloudinary configuration set karo with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // HTTPS enforce karo for production
});

// Upload function define karo
export function uploads(
  file: string,
  publicId?: string,
  overwrite: boolean = false, // Default to false for safety
  invalidate: boolean = false // Default to false to avoid unnecessary CDN invalidation
): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id: publicId,
        overwrite: overwrite,
        invalidate: invalidate,
        resource_type: 'auto', // Automatically detect file type (image, video, etc.)
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error); // Log error for debugging
          reject(error); // Error ko reject karo for better error handling
        } else {
          console.log('Cloudinary Upload Success:', result); // Log success for debugging
          resolve(result); // Success response return karo
        }
      }
    );
  });
}

// Video upload function define karo
export function videoUpload(
  file: string,
  publicId?: string,
  overwrite: boolean = false, // Default to false to avoid accidental overwrites
  invalidate: boolean = false // Default to false to avoid unnecessary CDN invalidation
): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_large(
      file,
      {
        public_id: publicId,
        overwrite: overwrite,
        invalidate: invalidate,
        resource_type: 'video', // Explicitly set to video
        chunk_size: 50000000, // 50MB chunks for large video uploads
        // Optional: Add transformations for video optimization
        transformation: [
          { fetch_format: 'auto', quality: 'auto' }, // Auto format (e.g., MP4/WebM) and quality
          { duration: 300 } // Example: Limit video to 5 minutes (300 seconds)
        ]
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error('Cloudinary Video Upload Error:', error); // Log error for debugging
          reject(error); // Error ko reject karo for better error handling
        } else {
          console.log('Cloudinary Video Upload Success:', result); // Log success for debugging
          resolve(result); // Success response return karo
        }
      }
    );
  });
}