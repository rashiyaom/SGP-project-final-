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

// ─── Gallery Configuration ────────────────────────────────────────────────────

export const GALLERY_CONFIG = {
  ITEMS_PER_PAGE: 12,

  SORT_OPTIONS: [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'az', label: 'A–Z' },
  ],

  CATEGORIES: [
    'All',
    'Ceramic Tiles',
    'Marble',
    'Bathroom & Sanitary Ware',
    'Accessories',
  ],
} as const

export const GALLERY_ANIMATIONS = {
  STAGGER_DELAY: 0.08, // seconds between card animations
  CARD_DURATION: 0.45, // card fade-in duration
  HERO_DELAY_STEP: 0.15, // delay between hero text lines
  HERO_DURATION: 0.6, // hero text animation duration
  OVERLAY_DURATION: 0.3, // hover overlay fade duration
  ACTIONS_DURATION: 0.3, // card action buttons slide duration
  TOAST_DURATION: 3000, // toast auto-dismiss in ms
  HEART_DURATION: 500, // heart pop animation in ms
  FAB_DELAY_STEP: 0.1, // delay between FAB reveal
  DEBOUNCE_MS: 300, // search debounce
} as const

export const GALLERY_MESSAGES = {
  SAVED: 'Saved to your Dream Board ✨',
  REMOVED: 'Removed from your Dream Board',
  LINK_COPIED: 'Link copied to clipboard!',
  AR_COMING_SOON: 'AR Preview coming soon!',
  VR_COMING_SOON: 'VR Tour coming soon!',
  LOAD_MORE: 'Load More',
  LOADING: 'Loading…',
  NO_RESULTS: 'No results found',
  NO_RESULTS_HINT: 'Try adjusting your search or filters',
  CLEAR_FILTERS: 'Clear Filters',
} as const
