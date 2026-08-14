export const WEBHOOK_ENDPOINTS = {
  WEBHOOKS: "/webhooks",
  WEBHOOK_DETAIL: "/webhooks", // + /{id}
  DELIVERIES: "/webhooks", // + /{id}/deliveries
  TEST: "/webhooks", // + /{id}/test
} as const;
