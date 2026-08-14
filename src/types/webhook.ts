/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Webhook {
  id: number;
  user_id: number;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookRequest {
  url: string;
  events: string[];
  active?: boolean;
}

export interface UpdateWebhookRequest {
  url?: string;
  events?: string[];
  active?: boolean;
}

export interface WebhookDelivery {
  id: number;
  webhook_id: number;
  event: string;
  payload: any;
  status_code: number;
  response: string;
  created_at: string;
}

export const WEBHOOK_EVENTS = [
  { value: "campaign.started", label: "Campaign started" },
  { value: "campaign.sent", label: "Campaign sent" },
  { value: "campaign.failed", label: "Campaign failed" },
] as const;
