/**
 * Single source of truth for cross-property URLs.
 * Platform now lives at platform.roshan-ai.com/shifamind (path-based, multi-product).
 */
export const PLATFORM_URL = 'https://platform.roshan-ai.com/shifamind';
export const PRODUCT_URL = 'https://shifamind.me';
export const CONTACT_EMAIL = 'mohammed@roshan-ai.com';

/** ShifaMind access is by request only: every "Request access" button opens this. */
export const REQUEST_ACCESS_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('ShifaMind access request')}`;

/** ShifaMind product walkthrough on YouTube. */
export const SHIFAMIND_DEMO_VIDEO_ID = 'CeP1bjZg0Rs';

/** Official Roshan AI social profiles. */
export const SOCIAL_LINKS = {
  x: 'https://x.com/RoshanAILabs',
  youtube: 'https://www.youtube.com/@RoshanAILabs',
  huggingface: 'https://huggingface.co/Roshan-ai-labs',
  linkedin: 'https://www.linkedin.com/company/roshanai/',
} as const;
