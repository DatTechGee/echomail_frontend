import instance from "../instance";

export const abTestService = {
  listForCampaign: (campaignUuid: string) => {
    return instance.get(`/campaigns/${campaignUuid}/ab-tests`);
  },

  getAbTest: (campaignUuid: string, abTestId: string) => {
    return instance.get(`/campaigns/${campaignUuid}/ab-tests/${abTestId}`);
  },

  createAbTest: (campaignUuid: string, data: {
    name?: string;
    test_type: "subject" | "content";
    test_percentage: number;
    variants: { subject?: string; content?: string }[];
  }) => {
    return instance.post(`/campaigns/${campaignUuid}/ab-tests`, data);
  },

  startAbTest: (campaignUuid: string, abTestId: string) => {
    return instance.post(`/campaigns/${campaignUuid}/ab-tests/${abTestId}/start`);
  },

  selectWinner: (campaignUuid: string, abTestId: string, variantId: number) => {
    return instance.post(`/campaigns/${campaignUuid}/ab-tests/${abTestId}/select-winner`, {
      variant_id: variantId,
    });
  },

  deleteAbTest: (campaignUuid: string, abTestId: string) => {
    return instance.delete(`/campaigns/${campaignUuid}/ab-tests/${abTestId}`);
  },
};
