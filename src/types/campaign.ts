/* eslint-disable @typescript-eslint/no-explicit-any */
export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "failed";

export type CampaignFrequency = "once" | "daily" | "weekly" | "monthly";

export type RecipientType = "all" | "newsletter" | "groups" | "manual";

export interface Campaign {
  uuid: string;
  name: string;
  subject: string;
  content?: string;
  html_content?: string;
  status: CampaignStatus;
  recipient_config: RecipientConfig;
  recipient_emails?: string[];
  total_recipients: number;
  total_sent: number;
  total_failed: number;
  opens: number;
  clicks: number;
  open_rate: number;
  click_rate: number;
  sent_at?: string | null;
  scheduled_at?: string | null;
  frequency?: string | null;
  next_run_at?: string | null;
  created_by?: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface RecipientConfig {
  type: RecipientType;
  groups?: string[];
  manual_emails?: string[];
}

// Request Types
export interface CreateCampaignRequest {
  name: string;
  subject: string;
  content: string;
  recipient_config: RecipientConfig;
  send_immediately?: boolean;
  scheduled_at?: string;
  frequency?: string;
}

export interface UpdateCampaignRequest {
  name?: string;
  subject?: string;
  content?: string;
  recipient_config?: RecipientConfig;
}

export interface GetCampaignsRequest {
  search?: string;
  status?: CampaignStatus;
  per_page?: number;
  page?: number;
  sort_by?: "name" | "subject" | "sent_at" | "total_recipients";
  sort_order?: "asc" | "desc";
}

export interface RecipientPreviewRequest {
  recipient_config: RecipientConfig;
}

// Response Types
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface CampaignStats {
  total_campaigns: number;
  sent_campaigns: number;
  draft_campaigns: number;
  failed_campaigns: number;
  total_emails_sent: number;
  total_opens: number;
  total_clicks: number;
  average_open_rate: number;
  average_click_rate: number;
}

export interface GetCampaignsResponse {
  campaigns: Campaign[];
  pagination: PaginationMeta;
  stats: CampaignStats;
}

export interface GetCampaignResponse {
  campaign: Campaign;
}

export interface CreateCampaignResponse {
  campaign: Campaign;
}

export interface UpdateCampaignResponse {
  campaign: Campaign;
}

export interface RecipientPreviewResponse {
  recipients: string[];
  total_count: number;
}

export interface CampaignPreviewResponse {
  subject: string;
  html: string;
}

export type RecipientStatus = "pending" | "sent" | "failed" | "bounced";

export interface CampaignRecipient {
  id: number;
  campaign_id: number;
  email: string;
  token: string;
  status: RecipientStatus;
  opened_at?: string | null;
  clicked_at?: string | null;
  error_message?: string | null;
  bounced_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignRecipientsRequest {
  status?: RecipientStatus;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface RecipientsSummary {
  pending: number;
  sent: number;
  failed: number;
  bounced: number;
  opened: number;
  clicked: number;
}

export interface CampaignRecipientsResponse {
  recipients: CampaignRecipient[];
  pagination: PaginationMeta;
  summary: RecipientsSummary;
}

export interface MonthlyActivityPoint {
  month: string;
  sent: number;
  opens: number;
  clicks: number;
}

export interface EngagementFunnel {
  sent: number;
  opened: number;
  clicked: number;
  open_rate: number;
  click_rate: number;
}

export interface GetStatsResponse {
  stats: CampaignStats;
  recent_campaigns: Campaign[];
  monthly_activity: MonthlyActivityPoint[];
  engagement: EngagementFunnel;
}

// UI Types
export interface CampaignFormData {
  name: string;
  subject: string;
  content: string;
  recipientMode: RecipientType;
  selectedGroups: string[];
  manualRecipients: string[];
}

export interface RecipientModeOption {
  id: RecipientType;
  title: string;
  description: string;
  icon: any;
}

export interface StatusOption {
  value: CampaignStatus | "";
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

// Campaign metrics for display
export interface CampaignMetrics {
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
  open_rate: number;
  click_rate: number;
}

// Campaign performance data
export interface CampaignPerformance {
  total_recipients: number;
  total_sent: number;
  total_failed: number;
  success_rate: number;
  opens: number;
  clicks: number;
  open_rate: number;
  click_rate: number;
}

// Template for campaign creation
export interface CampaignTemplate {
  name: string;
  subject: string;
  content: string;
  description?: string;
}
