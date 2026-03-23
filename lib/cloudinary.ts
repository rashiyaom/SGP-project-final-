import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
}

/**
 * Upload an image to Cloudinary from a URL
 */
export async function uploadImageFromUrl(imageUrl: string, folder = 'omkar-ceramics'): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    })

    return {
      url: result.secure_url || result.url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw error
  }
}

/**
 * Upload an image to Cloudinary from a file (Base64)
 */
export async function uploadImageFromBase64(base64Data: string, folder = 'omkar-ceramics'): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    })

    return {
      url: result.secure_url || result.url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw error
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}

/**
 * Generate a responsive image URL with transformations
 */
export function getImageUrl(publicId: string, options?: Record<string, any>): string {
  try {
    return cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...options,
    })
  } catch (error) {
    console.error('Error generating image URL:', error)
    return ''
  }
}

/**
 * Get optimized image URL for thumbnails
 */
export function getThumbnailUrl(publicId: string, width = 200, height = 200): string {
  return getImageUrl(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
  })
}

/**
 * Get optimized image URL for product display
 */
export function getProductImageUrl(publicId: string, width = 600, height = 600): string {
  return getImageUrl(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
  })
}

export default cloudinary
