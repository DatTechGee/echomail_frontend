import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { webhookService } from "@/services/api/webhook.services";
import type {
  CreateWebhookRequest,
  UpdateWebhookRequest,
} from "@/types/webhook";

export const webhookKeys = {
  all: ["webhooks"] as const,
  lists: () => [...webhookKeys.all, "list"] as const,
  list: () => [...webhookKeys.lists()] as const,
  deliveries: (id: number) => [...webhookKeys.all, "deliveries", id] as const,
} as const;

export const useWebhooks = () => {
  return useQuery({
    queryKey: webhookKeys.list(),
    queryFn: () => webhookService.getWebhooks(),
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebhookRequest) =>
      webhookService.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
};

export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWebhookRequest }) =>
      webhookService.updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => webhookService.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
};

export const useWebhookDeliveries = (id: number) => {
  return useQuery({
    queryKey: webhookKeys.deliveries(id),
    queryFn: () => webhookService.getDeliveries(id),
    enabled: !!id,
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: (id: number) => webhookService.testWebhook(id),
  });
};
