import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { abTestService } from "@/services/api/abTest.services";

export const abTestKeys = {
  all: ["abTests"] as const,
  list: (campaignUuid: string) => [...abTestKeys.all, "list", campaignUuid] as const,
  detail: (campaignUuid: string, abTestId: string) =>
    [...abTestKeys.all, "detail", campaignUuid, abTestId] as const,
};

export const useAbTests = (campaignUuid: string) => {
  return useQuery({
    queryKey: abTestKeys.list(campaignUuid),
    queryFn: () => abTestService.listForCampaign(campaignUuid),
    enabled: !!campaignUuid,
  });
};

export const useAbTest = (campaignUuid: string, abTestId: string) => {
  return useQuery({
    queryKey: abTestKeys.detail(campaignUuid, abTestId),
    queryFn: () => abTestService.getAbTest(campaignUuid, abTestId),
    enabled: !!campaignUuid && !!abTestId,
  });
};

export const useCreateAbTest = (campaignUuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof abTestService.createAbTest>[1]) =>
      abTestService.createAbTest(campaignUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: abTestKeys.list(campaignUuid) });
    },
  });
};

export const useStartAbTest = (campaignUuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (abTestId: string) => abTestService.startAbTest(campaignUuid, abTestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: abTestKeys.list(campaignUuid) });
    },
  });
};

export const useSelectAbTestWinner = (campaignUuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ abTestId, variantId }: { abTestId: string; variantId: number }) =>
      abTestService.selectWinner(campaignUuid, abTestId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: abTestKeys.list(campaignUuid) });
    },
  });
};

export const useDeleteAbTest = (campaignUuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (abTestId: string) => abTestService.deleteAbTest(campaignUuid, abTestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: abTestKeys.list(campaignUuid) });
    },
  });
};
