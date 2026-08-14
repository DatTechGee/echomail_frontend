/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CAMPAIGN_ENDPOINTS } from "../endpoints/campaign";
import type {
  CreateCampaignRequest,
  UpdateCampaignRequest,
  GetCampaignsRequest,
  RecipientPreviewRequest,
  ApiResponse,
  GetCampaignsResponse,
  GetCampaignResponse,
  CreateCampaignResponse,
  UpdateCampaignResponse,
  RecipientPreviewResponse,
  CampaignPreviewResponse,
  CampaignRecipientsRequest,
  CampaignRecipientsResponse,
  GetStatsResponse,
} from "@/types/campaign";
import instance from "../instance";

export const campaignService = {
  // Campaign CRUD operations
  getCampaigns: (params?: GetCampaignsRequest) => {
    return instance.get<ApiResponse<GetCampaignsResponse>>(
      CAMPAIGN_ENDPOINTS.CAMPAIGNS,
      { params }
    );
  },

  getCampaign: (uuid: string) => {
    return instance.get<ApiResponse<GetCampaignResponse>>(
      `${CAMPAIGN_ENDPOINTS.CAMPAIGN_DETAIL}/${uuid}`
    );
  },

  createCampaign: (data: CreateCampaignRequest) => {
    return instance.post<ApiResponse<CreateCampaignResponse>>(
      CAMPAIGN_ENDPOINTS.CAMPAIGNS,
      data
    );
  },

  updateCampaign: (uuid: string, data: UpdateCampaignRequest) => {
    return instance.put<ApiResponse<UpdateCampaignResponse>>(
      `${CAMPAIGN_ENDPOINTS.CAMPAIGN_DETAIL}/${uuid}`,
      data
    );
  },

  deleteCampaign: (uuid: string) => {
    return instance.delete<ApiResponse<{}>>(
      `${CAMPAIGN_ENDPOINTS.CAMPAIGN_DETAIL}/${uuid}`
    );
  },

  // Campaign actions
  sendCampaign: (uuid: string) => {
    return instance.post<ApiResponse<{ campaign: any }>>(
      `${CAMPAIGN_ENDPOINTS.SEND}/${uuid}/send`
    );
  },

  retryCampaign: (uuid: string) => {
    return instance.post<ApiResponse<{ campaign: any }>>(
      `${CAMPAIGN_ENDPOINTS.RETRY}/${uuid}/retry`
    );
  },

  duplicateCampaign: (uuid: string) => {
    return instance.post<ApiResponse<CreateCampaignResponse>>(
      `${CAMPAIGN_ENDPOINTS.DUPLICATE}/${uuid}/duplicate`
    );
  },

  // Utilities
  getRecipientPreview: (data: RecipientPreviewRequest) => {
    return instance.post<ApiResponse<RecipientPreviewResponse>>(
      CAMPAIGN_ENDPOINTS.RECIPIENT_PREVIEW,
      data
    );
  },

  testSendCampaign: (uuid: string, data: { email: string }) => {
    return instance.post<ApiResponse<{}>>(
      `${CAMPAIGN_ENDPOINTS.TEST_SEND}/${uuid}/test-send`,
      data
    );
  },

  previewCampaign: (uuid: string) => {
    return instance.get<ApiResponse<CampaignPreviewResponse>>(
      `${CAMPAIGN_ENDPOINTS.PREVIEW}/${uuid}/preview`
    );
  },

  getRecipients: (uuid: string, params?: CampaignRecipientsRequest) => {
    return instance.get<ApiResponse<CampaignRecipientsResponse>>(
      `${CAMPAIGN_ENDPOINTS.RECIPIENTS}/${uuid}/recipients`,
      { params }
    );
  },

  exportRecipients: (uuid: string) => {
    return instance.get(`${CAMPAIGN_ENDPOINTS.EXPORT}/${uuid}/export`, {
      responseType: "blob",
    });
  },

  markBounced: (uuid: string, emails: string[]) => {
    return instance.post<ApiResponse<{ updated: number }>>(
      `${CAMPAIGN_ENDPOINTS.MARK_BOUNCED}/${uuid}/mark-bounced`,
      { emails }
    );
  },

  getStats: () => {
    return instance.get<ApiResponse<GetStatsResponse>>(
      CAMPAIGN_ENDPOINTS.STATS
    );
  },
};
