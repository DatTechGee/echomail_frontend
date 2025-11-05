export const NEWSLETTER_ENDPOINTS = {
  // Public endpoints
  SUBSCRIBE: "/newsletter/subscribe",
  UNSUBSCRIBE: "/newsletter/unsubscribe", // + /{token}

  // Admin endpoints
  SUBSCRIBERS: "/newsletter/subscribers",
  SUBSCRIBER_DETAIL: "/newsletter/subscribers", // + /{uuid}
  BULK_DELETE: "/newsletter/subscribers",
  EXPORT: "/newsletter/export",
  STATS: "/newsletter/stats",
} as const;
