/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NEWSLETTER_ENDPOINTS } from "../endpoints/newsletter";
import type {
  SubscribeRequest,
  GetSubscribersRequest,
  BulkDeleteRequest,
  ExportRequest,
  ApiResponse,
  SubscribeResponse,
  GetSubscribersResponse,
  GetSubscriberResponse,
  GetStatsResponse,
  BulkDeleteResponse,
} from "@/types/newsletter";
import instance from "../instance";

export const newsletterService = {
  // Public methods
  subscribe: (data: SubscribeRequest) => {
    return instance.post<ApiResponse<SubscribeResponse>>(
      NEWSLETTER_ENDPOINTS.SUBSCRIBE,
      data
    );
  },

  unsubscribe: (token: string) => {
    return instance.get<ApiResponse<{}>>(
      `${NEWSLETTER_ENDPOINTS.UNSUBSCRIBE}/${token}`
    );
  },

  // Admin methods
  getSubscribers: (params?: GetSubscribersRequest) => {
    return instance.get<ApiResponse<GetSubscribersResponse>>(
      NEWSLETTER_ENDPOINTS.SUBSCRIBERS,
      { params }
    );
  },

  getSubscriber: (uuid: string) => {
    return instance.get<ApiResponse<GetSubscriberResponse>>(
      `${NEWSLETTER_ENDPOINTS.SUBSCRIBER_DETAIL}/${uuid}`
    );
  },

  deleteSubscriber: (uuid: string) => {
    return instance.delete<ApiResponse<{}>>(
      `${NEWSLETTER_ENDPOINTS.SUBSCRIBER_DETAIL}/${uuid}`
    );
  },

  bulkDeleteSubscribers: (data: BulkDeleteRequest) => {
    return instance.delete<ApiResponse<BulkDeleteResponse>>(
      NEWSLETTER_ENDPOINTS.BULK_DELETE,
      { data }
    );
  },

  exportSubscribers: (params?: ExportRequest) => {
    if (params?.format === "csv") {
      return instance.get(NEWSLETTER_ENDPOINTS.EXPORT, {
        params,
        responseType: "blob",
      });
    }
    return instance.get<ApiResponse<{ subscribers: any[] }>>(
      NEWSLETTER_ENDPOINTS.EXPORT,
      { params }
    );
  },

  getStats: () => {
    return instance.get<ApiResponse<GetStatsResponse>>(
      NEWSLETTER_ENDPOINTS.STATS
    );
  },
};
