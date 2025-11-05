export const CAMPAIGN_ENDPOINTS = {
  // Campaign CRUD
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_DETAIL: "/campaigns", // + /{uuid}

  // Campaign actions
  SEND: "/campaigns", // + /{uuid}/send
  DUPLICATE: "/campaigns", // + /{uuid}/duplicate

  // Utilities
  RECIPIENT_PREVIEW: "/campaigns/recipient-preview",
  STATS: "/campaigns/stats",
} as const;
