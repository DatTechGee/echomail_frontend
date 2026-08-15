import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { automationService, CreateAutomationRequest } from "@/services/api/automation.services";

export const automationKeys = {
  all: ["automations"] as const,
  lists: () => [...automationKeys.all, "list"] as const,
  list: (params?: any) => [...automationKeys.lists(), params] as const,
  detail: (uuid: string) => [...automationKeys.all, "detail", uuid] as const,
  stats: () => [...automationKeys.all, "stats"] as const,
  enrollments: (uuid: string) => [...automationKeys.all, "enrollments", uuid] as const,
};

export const useAutomations = (params?: { status?: string; search?: string; per_page?: number }) => {
  return useQuery({
    queryKey: automationKeys.list(params),
    queryFn: () => automationService.list(params),
  });
};

export const useAutomation = (uuid: string) => {
  return useQuery({
    queryKey: automationKeys.detail(uuid),
    queryFn: () => automationService.getAutomation(uuid),
    enabled: !!uuid,
  });
};

export const useAutomationStats = () => {
  return useQuery({
    queryKey: automationKeys.stats(),
    queryFn: () => automationService.getStats(),
  });
};

export const useAutomationEnrollments = (uuid: string) => {
  return useQuery({
    queryKey: automationKeys.enrollments(uuid),
    queryFn: () => automationService.getEnrollments(uuid),
    enabled: !!uuid,
  });
};

export const useCreateAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAutomationRequest) => automationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: automationKeys.stats() });
    },
  });
};

export const useUpdateAutomation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateAutomationRequest>) => automationService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.detail(uuid) });
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() });
    },
  });
};

export const useActivateAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => automationService.activate(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: automationKeys.stats() });
    },
  });
};

export const usePauseAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => automationService.pause(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: automationKeys.stats() });
    },
  });
};

export const useEnrollInAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: { email: string; name?: string } }) =>
      automationService.enroll(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.enrollments(uuid) });
      queryClient.invalidateQueries({ queryKey: automationKeys.detail(uuid) });
    },
  });
};

export const useDeleteAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => automationService.delete(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: automationKeys.stats() });
    },
  });
};
