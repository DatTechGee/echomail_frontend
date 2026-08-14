import { WEBHOOK_ENDPOINTS } from "../endpoints/webhook";
import type { ApiResponse } from "@/types/campaign";
import type {
  Webhook,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  WebhookDelivery,
} from "@/types/webhook";
import instance from "../instance";

export const webhookService = {
  getWebhooks: () => {
    return instance.get<ApiResponse<{ webhooks: Webhook[] }>>(
      WEBHOOK_ENDPOINTS.WEBHOOKS
    );
  },

  createWebhook: (data: CreateWebhookRequest) => {
    return instance.post<ApiResponse<{ webhook: Webhook }>>(
      WEBHOOK_ENDPOINTS.WEBHOOKS,
      data
    );
  },

  updateWebhook: (id: number, data: UpdateWebhookRequest) => {
    return instance.put<ApiResponse<{ webhook: Webhook }>>(
      `${WEBHOOK_ENDPOINTS.WEBHOOK_DETAIL}/${id}`,
      data
    );
  },

  deleteWebhook: (id: number) => {
    return instance.delete<ApiResponse<{}>>(
      `${WEBHOOK_ENDPOINTS.WEBHOOK_DETAIL}/${id}`
    );
  },

  getDeliveries: (id: number) => {
    return instance.get<ApiResponse<{ deliveries: WebhookDelivery[] }>>(
      `${WEBHOOK_ENDPOINTS.DELIVERIES}/${id}/deliveries`
    );
  },

  testWebhook: (id: number) => {
    return instance.post<ApiResponse<{}>>(
      `${WEBHOOK_ENDPOINTS.TEST}/${id}/test`
    );
  },
};
