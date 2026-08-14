import { AUDIT_ENDPOINTS } from "../endpoints/audit";
import type { ApiResponse, PaginationMeta } from "@/types/campaign";
import type { AuditLog, AuditLogsRequest } from "@/types/audit";
import instance from "../instance";

export const auditService = {
  getAuditLogs: (params?: AuditLogsRequest) => {
    return instance.get<ApiResponse<{ logs: AuditLog[]; pagination: PaginationMeta }>>(
      AUDIT_ENDPOINTS.AUDIT_LOGS,
      { params }
    );
  },

  clearAuditLogs: (olderThanDays?: number) => {
    return instance.delete<ApiResponse<{ deleted: number }>>(
      AUDIT_ENDPOINTS.AUDIT_LOGS,
      { params: olderThanDays ? { older_than_days: olderThanDays } : {} }
    );
  },
};
