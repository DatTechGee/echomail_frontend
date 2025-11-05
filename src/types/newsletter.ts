/* eslint-disable @typescript-eslint/no-explicit-any */
export type NewsletterStatus = "active" | "unsubscribed";

export type NewsletterSource =
  | "website"
  | "social"
  | "search"
  | "referral"
  | "advertising"
  | "blog"
  | "other";

export interface NewsletterSubscriber {
  uuid: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  source: NewsletterSource;
  status: NewsletterStatus;
  subscribed_at: string;
  unsubscribed_at?: string | null;
  created_at: string;
}

// Request Types
export interface SubscribeRequest {
  email: string;
  name?: string;
  phone?: string;
  source: NewsletterSource;
}

export interface GetSubscribersRequest {
  search?: string;
  status?: "all" | NewsletterStatus;
  source?: NewsletterSource;
  per_page?: number;
  page?: number;
  sort_by?: "email" | "name" | "subscribed_at" | "status" | "source";
  sort_order?: "asc" | "desc";
}

export interface BulkDeleteRequest {
  subscriber_ids: string[];
}

export interface ExportRequest {
  status?: "all" | NewsletterStatus;
  source?: NewsletterSource;
  format?: "csv" | "json";
}

// Response Types
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

export interface SubscribeResponse {
  subscriber: NewsletterSubscriber;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed: number;
  subscribers_today: number;
  subscribers_this_week: number;
  subscribers_this_month: number;
  subscribers_this_year: number;
  unsubscribes_this_month: number;
}

export interface SourceStats {
  [key: string]: number;
}

export interface MonthlyGrowth {
  month: string;
  subscribers: number;
}

export interface GetSubscribersResponse {
  subscribers: NewsletterSubscriber[];
  pagination: PaginationMeta;
  stats: {
    total: number;
    active: number;
    unsubscribed: number;
    today: number;
    this_week: number;
    this_month: number;
  };
}

export interface GetStatsResponse {
  overview: NewsletterStats;
  sources: SourceStats;
  monthly_growth: MonthlyGrowth[];
}

export interface BulkDeleteResponse {
  deleted_count: number;
}

export interface GetSubscriberResponse {
  subscriber: NewsletterSubscriber;
}

// Source options for UI
export interface SourceOption {
  value: NewsletterSource | "";
  label: string;
  icon?: any;
}
