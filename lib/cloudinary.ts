/**
 * Cloudinary Image Upload & Optimization Utilities
 * 
 * This module provides utilities for uploading images to Cloudinary
 * and generating optimized URLs for different use cases.
 * 
 * Setup:
 * 1. Add to .env.local:
 *    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=luxe_tiles_unsigned
 *    CLOUDINARY_API_KEY=your_api_key (server-only)
 *    CLOUDINARY_API_SECRET=your_api_secret (server-only)
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

// Validate credentials on load
if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn(
    '⚠️ Missing Cloudinary credentials. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local'
  )
}

/**
 * Type definitions for Cloudinary responses
 */
export interface CloudinaryUploadResponse {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  secureUrl: string
}

export interface CloudinaryUrlOptions {
  width?: number
  height?: number
  quality?: number | 'auto'
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif'
  crop?: 'fill' | 'scale' | 'fit' | 'thumb'
  gravity?: 'auto' | 'center' | 'face'
  aspectRatio?: string
  radius?: number | 'max'
}

/**
 * Generate optimized Cloudinary URL with transformations
 *
 * @example
 * ```typescript
 * // Get a 400x400 thumbnail
 * const url = getCloudinaryUrl('products/ceramic_001', {
 *   width: 400,
 *   height: 400,
 *   quality: 80,
 * })
 *
 * // Get an auto-optimized URL
 * const url = getCloudinaryUrl('products/ceramic_001', {
 *   width: 600,
 *   quality: 'auto',
 *   format: 'auto',
 * })
 * ```
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryUrlOptions = {}
): string {
  if (!CLOUD_NAME) {
    console.warn('Cloudinary cloud name not configured')
    return ''
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    aspectRatio,
    radius,
  } = options

  const transformations: string[] = []

  // Add dimension transformations
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (aspectRatio) transformations.push(`ar_${aspectRatio}`)

  // Add crop and gravity
  if (crop) transformations.push(`c_${crop}`)
  if (gravity !== 'auto') transformations.push(`g_${gravity}`)

  // Add quality and format
  if (quality) transformations.push(`q_${quality}`)
  if (format) transformations.push(`f_${format}`)

  // Add rounding if specified
  if (radius) {
    transformations.push(`r_${radius === 'max' ? 'max' : radius}`)
  }

  const transform = transformations.length > 0 ? transformations.join(',') : ''

  if (transform) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`
}

/**
 * Upload a file to Cloudinary (unsigned upload)
 * 
 * Unsigned uploads don't require API credentials and can be used from the client.
 * Make sure to set up an unsigned upload preset in your Cloudinary account.
 *
 * @example
 * ```typescript
 * const file = event.target.files[0]
 * const result = await uploadToCloudinary(file)
 * console.log(result.url) // Full Cloudinary URL
 * ```
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'luxe-tiles/products'
): Promise<CloudinaryUploadResponse> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary credentials not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)
  formData.append('context', `filename=${file.name}`)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      secureUrl: data.secure_url,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

/**
 * Delete a file from Cloudinary (server-side only)
 * Requires API key and secret
 *
 * @example
 * ```typescript
 * // Use in API route (server-side only)
 * await deleteFromCloudinary('products/ceramic_001')
 * ```
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    throw new Error('Cloudinary API credentials not configured')
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        public_id: publicId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Delete failed: ${error.error?.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw error
  }
}

/**
 * Get thumbnail URL (300x300, compressed)
 * Use for product listings
 *
 * @example
 * ```typescript
 * const thumbUrl = getThumbnailUrl('products/ceramic_001')
 * ```
 */
export function getThumbnailUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 300,
    height: 300,
    quality: 80,
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  })
}

/**
 * Get product detail image URL (600x600, high quality)
 * Use for product detail pages
 *
 * @example
 * ```typescript
 * const detailUrl = getProductImageUrl('products/ceramic_001')
 * ```
 */
export function getProductImageUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 600,
    height: 600,
    quality: 90,
    format: 'auto',
    crop: 'fill',
    gravity: 'face',
  })
}

/**
 * Get hero/gallery image URL (1200 wide, optimized)
 * Use for large display images
 *
 * @example
 * ```typescript
 * const galleryUrl = getGalleryImageUrl('luxe-tiles/inspiration_001')
 * ```
 */
export function getGalleryImageUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 1200,
    height: 800,
    quality: 85,
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  })
}

/**
 * Get mobile-optimized image URL (480 wide)
 * Use for mobile device displays
 *
 * @example
 * ```typescript
 * const mobileUrl = getMobileImageUrl('products/ceramic_001')
 * ```
 */
export function getMobileImageUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 480,
    height: 480,
    quality: 75,
    format: 'auto',
    crop: 'fill',
  })
}

/**
 * Get avatar image URL (rounded, 100x100)
 * Use for user profile pictures
 *
 * @example
 * ```typescript
 * const avatarUrl = getAvatarUrl('users/profile_001')
 * ```
 */
export function getAvatarUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 100,
    height: 100,
    quality: 80,
    format: 'auto',
    crop: 'thumb',
    gravity: 'face',
    radius: 'max',
  })
}

/**
 * Extract public ID from Cloudinary URL
 *
 * @example
 * ```typescript
 * const publicId = extractPublicId(
 *   'https://res.cloudinary.com/luxe-tiles/image/upload/v1700/products/ceramic_001.jpg'
 * )
 * // Returns: 'products/ceramic_001'
 * ```
 */
export function extractPublicId(url: string): string {
  try {
    // Pattern: /upload/{transformations}/{public_id}
    const match = url.match(/\/upload\/(?:[^/]+\/)*(.+?)(?:\.\w+)?$/)
    return match ? match[1] : url
  } catch {
    return url
  }
}

/**
 * Check if a string is a valid Cloudinary public ID
 *
 * @example
 * ```typescript
 * isValidPublicId('products/ceramic_001') // true
 * isValidPublicId('invalid/file/path/to/image') // true (any valid path)
 * ```
 */
export function isValidPublicId(publicId: string): boolean {
  return typeof publicId === 'string' && publicId.length > 0 && !publicId.includes('http')
}

/**
 * Generate srcset for responsive images
 *
 * @example
 * ```typescript
 * const srcSet = generateSrcSet('products/ceramic_001', {
 *   sizes: [300, 600, 1200],
 *   quality: 'auto',
 * })
 * // Returns: "url1 300w, url2 600w, url3 1200w"
 * ```
 */
export function generateSrcSet(
  publicId: string,
  options: {
    sizes: number[]
    quality?: number | 'auto'
    format?: CloudinaryUrlOptions['format']
  } = { sizes: [300, 600, 1200] }
): string {
  const { sizes, quality = 'auto', format = 'auto' } = options

  return sizes
    .map((size) => {
      const url = getCloudinaryUrl(publicId, {
        width: size,
        height: size,
        quality,
        format,
        crop: 'fill',
      })
      return `${url} ${size}w`
    })
    .join(', ')
}

/**
 * Cloudinary configuration helper for Next.js Image component
 * Use with next/image for optimized image serving
 *
 * @example
 * ```typescript
 * // In next.config.mjs
 * const nextConfig = {
 *   images: {
 *     remotePatterns: [cloudinaryLoader()],
 *   },
 * }
 * ```
 */
export function cloudinaryLoader() {
  return {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
    pathname: '/**',
  }
}

/**
 * Format bytes to human-readable size
 * Use for displaying file sizes
 *
 * @example
 * ```typescript
 * formatFileSize(1024 * 1024) // "1.0 MB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File, options = { maxSize: 10 * 1024 * 1024 }): {
  valid: boolean
  error?: string
} {
  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (!validMimes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.',
    }
  }

  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size too large. Maximum is ${formatFileSize(options.maxSize)}.`,
    }
  }

  return { valid: true }
}
