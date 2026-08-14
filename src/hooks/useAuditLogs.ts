import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auditService } from "@/services/api/audit.services";
import type { AuditLogsRequest } from "@/types/audit";

export const auditKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditKeys.all, "list"] as const,
  list: (params?: AuditLogsRequest) => [...auditKeys.lists(), params] as const,
} as const;

export const useAuditLogs = (params?: AuditLogsRequest) => {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditService.getAuditLogs(params),
  });
};

export const useClearAuditLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (olderThanDays?: number) =>
      auditService.clearAuditLogs(olderThanDays),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.all });
    },
  });
};
