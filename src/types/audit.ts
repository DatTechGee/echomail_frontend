export interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLogsRequest {
  action?: string;
  entity_type?: string;
  per_page?: number;
  page?: number;
}
