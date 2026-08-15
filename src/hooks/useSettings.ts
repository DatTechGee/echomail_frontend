import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, SmtpSettings } from "@/services/api/settings.services";

export const settingsKeys = {
  all: ["settings"] as const,
  smtp: () => [...settingsKeys.all, "smtp"] as const,
  apiKeys: () => [...settingsKeys.all, "api-keys"] as const,
};

export const useSmtpSettings = () => {
  return useQuery({
    queryKey: settingsKeys.smtp(),
    queryFn: () => settingsService.getSmtp(),
  });
};

export const useUpdateSmtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SmtpSettings) => settingsService.updateSmtp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.smtp() });
    },
  });
};

export const useTestSmtp = () => {
  return useMutation({
    mutationFn: (data: SmtpSettings & { to_email: string }) =>
      settingsService.testSmtp(data),
  });
};

export const useTestSmtpConnection = () => {
  return useMutation({
    mutationFn: (data: Omit<SmtpSettings, "from_address" | "from_name">) =>
      settingsService.testSmtpConnection(data),
  });
};

export const useApiKeys = () => {
  return useQuery({
    queryKey: settingsKeys.apiKeys(),
    queryFn: () => settingsService.listApiKeys(),
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; permissions?: string[] }) =>
      settingsService.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys() });
    },
  });
};

export const useToggleApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsService.toggleApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys() });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsService.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys() });
    },
  });
};
