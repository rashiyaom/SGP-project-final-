/**
 * Application-wide constants
 * Centralized configuration for timeouts, durations, and magic numbers
 */

// Toast/Notification timings (ms)
export const TOAST_DURATION = {
  DEFAULT: 2500,
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
} as const

// Animation timings (ms)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const

// Input/Form validation
export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MIN_PASSWORD_LENGTH: 6,
  MAX_MESSAGE_LENGTH: 5000,
  PHONE_MIN_LENGTH: 10,
} as const

// Pagination/Limits
export const LIMITS = {
  PRODUCTS_PER_PAGE: 12,
  GALLERY_ITEMS_PER_PAGE: 9,
  RELATED_PRODUCTS_COUNT: 6,
  SIMILAR_INSPIRATIONS_COUNT: 3,
  MAX_PRODUCT_FILTERS: 4,
  SEARCH_DEBOUNCE_MS: 300,
} as const

// UI Layout values (Tailwind)
export const LAYOUT = {
  MAX_WIDTH_CONTAINER: '7xl',
  PADDING_MOBILE: 'px-6',
  PADDING_DESKTOP: 'lg:px-12',
  GRID_GAP_MOBILE: 'gap-4',
  GRID_GAP_DESKTOP: 'lg:gap-6',
} as const

// Category names - single source of truth
export const CATEGORY_NAMES = {
  CERAMIC: 'Ceramic Tiles',
  MARBLE: 'Marble',
  SANITARY: 'Bathroom & Sanitary Ware',
  ACCESSORIES: 'Accessories',
} as const

// Status codes/Messages
export const MESSAGES = {
  SUCCESS_ADD_TO_CART: 'Added to cart!',
  SUCCESS_SAVE_DREAM: 'Added to your dreams!',
  SUCCESS_REMOVE_DREAM: 'Removed from your dreams',
  ERROR_LOAD_FAILED: 'Failed to load data',
  ERROR_SAVE_FAILED: 'Failed to save changes',
  COMING_SOON: 'Coming soon!',
} as const
