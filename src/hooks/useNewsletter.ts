import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsletterService } from "@/services/api/newsletter.services";
import type {
  SubscribeRequest,
  GetSubscribersRequest,
  BulkDeleteRequest,
  ExportRequest,
} from "@/types/newsletter";

// Query Keys
export const newsletterKeys = {
  all: ["newsletter"] as const,
  subscribers: () => [...newsletterKeys.all, "subscribers"] as const,
  subscribersList: (params?: GetSubscribersRequest) =>
    [...newsletterKeys.subscribers(), "list", params] as const,
  subscriber: (uuid: string) =>
    [...newsletterKeys.subscribers(), "detail", uuid] as const,
  stats: () => [...newsletterKeys.all, "stats"] as const,
} as const;

// Public hooks
export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: (data: SubscribeRequest) => newsletterService.subscribe(data),
  });
};

export const useUnsubscribeNewsletter = () => {
  return useMutation({
    mutationFn: (token: string) => newsletterService.unsubscribe(token),
  });
};

// Admin hooks
export const useNewsletterSubscribers = (params?: GetSubscribersRequest) => {
  return useQuery({
    queryKey: newsletterKeys.subscribersList(params),
    queryFn: () => newsletterService.getSubscribers(params),
  });
};

export const useNewsletterSubscriber = (uuid: string) => {
  return useQuery({
    queryKey: newsletterKeys.subscriber(uuid),
    queryFn: () => newsletterService.getSubscriber(uuid),
    enabled: !!uuid,
  });
};

export const useDeleteNewsletterSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => newsletterService.deleteSubscriber(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribers() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useBulkDeleteNewsletterSubscribers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkDeleteRequest) =>
      newsletterService.bulkDeleteSubscribers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribers() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useExportNewsletterSubscribers = () => {
  return useMutation({
    mutationFn: (params?: ExportRequest) =>
      newsletterService.exportSubscribers(params),
  });
};

export const useNewsletterStats = () => {
  return useQuery({
    queryKey: newsletterKeys.stats(),
    queryFn: () => newsletterService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Utility hook for refreshing newsletter data
export const useRefreshNewsletterData = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
  };
};
