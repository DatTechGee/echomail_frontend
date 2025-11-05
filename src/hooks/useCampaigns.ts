import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { campaignService } from "@/services/api/campaign.services";
import type {
  CreateCampaignRequest,
  UpdateCampaignRequest,
  GetCampaignsRequest,
  RecipientPreviewRequest,
} from "@/types/campaign";

// Query Keys
export const campaignKeys = {
  all: ["campaigns"] as const,
  lists: () => [...campaignKeys.all, "list"] as const,
  list: (params?: GetCampaignsRequest) =>
    [...campaignKeys.lists(), params] as const,
  details: () => [...campaignKeys.all, "detail"] as const,
  detail: (uuid: string) => [...campaignKeys.details(), uuid] as const,
  stats: () => [...campaignKeys.all, "stats"] as const,
} as const;

// Campaign CRUD hooks
export const useCampaigns = (params?: GetCampaignsRequest) => {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => campaignService.getCampaigns(params),
  });
};

export const useCampaign = (uuid: string) => {
  return useQuery({
    queryKey: campaignKeys.detail(uuid),
    queryFn: () => campaignService.getCampaign(uuid),
    enabled: !!uuid,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) =>
      campaignService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: UpdateCampaignRequest;
    }) => campaignService.updateCampaign(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(uuid) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => campaignService.deleteCampaign(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
    },
  });
};

// Campaign action hooks
export const useSendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => campaignService.sendCampaign(uuid),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(uuid) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
    },
  });
};

export const useDuplicateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => campaignService.duplicateCampaign(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
    },
  });
};

// Utility hooks
export const useRecipientPreview = () => {
  return useMutation({
    mutationFn: (data: RecipientPreviewRequest) =>
      campaignService.getRecipientPreview(data),
  });
};

export const useCampaignStats = () => {
  return useQuery({
    queryKey: campaignKeys.stats(),
    queryFn: () => campaignService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Utility hook for refreshing campaign data
export const useRefreshCampaignData = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: campaignKeys.all });
  };
};
