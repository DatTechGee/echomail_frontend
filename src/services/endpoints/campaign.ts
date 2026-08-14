export const CAMPAIGN_ENDPOINTS = {
  // Campaign CRUD
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_DETAIL: "/campaigns", // + /{uuid}

  // Campaign actions
  SEND: "/campaigns", // + /{uuid}/send
  RETRY: "/campaigns", // + /{uuid}/retry
  DUPLICATE: "/campaigns", // + /{uuid}/duplicate
  TEST_SEND: "/campaigns", // + /{uuid}/test-send
  PREVIEW: "/campaigns", // + /{uuid}/preview
  RECIPIENTS: "/campaigns", // + /{uuid}/recipients
  EXPORT: "/campaigns", // + /{uuid}/export
  MARK_BOUNCED: "/campaigns", // + /{uuid}/mark-bounced

  // Utilities
  RECIPIENT_PREVIEW: "/campaigns/recipient-preview",
  STATS: "/campaigns/stats",
} as const;
