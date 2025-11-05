/* eslint-disable @typescript-eslint/no-explicit-any */
export type ContactSource = "manual" | "csv" | "newsletter";

export interface Contact {
  uuid: string;
  email: string;
  name?: string | null;
  groups: string[];
  source: ContactSource;
  added_at: string;
  initials: string;
  created_at: string;
}

export interface ContactGroup {
  uuid: string;
  name: string;
  description?: string | null;
  color: string;
  contacts_count: number;
  is_predefined?: boolean;
  created_at: string;
}

// Request Types
export interface CreateContactRequest {
  email: string;
  name?: string;
  groups?: string[];
}

export interface UpdateContactRequest {
  email?: string;
  name?: string;
  groups?: string[];
}

export interface GetContactsRequest {
  search?: string;
  group?: string;
  source?: ContactSource;
  per_page?: number;
  page?: number;
  sort_by?: "email" | "name" | "added_at" | "source";
  sort_order?: "asc" | "desc";
}

export interface BulkDeleteContactsRequest {
  contact_ids: string[];
}

export interface ImportCsvRequest {
  contacts: CsvContactData[];
}

export interface CsvContactData {
  email: string;
  name?: string;
  groups?: string[];
}

export interface ExportContactsRequest {
  group?: string;
  source?: ContactSource;
  format?: "csv" | "json";
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  color?: string;
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

export interface ContactStats {
  total: number;
  manual: number;
  csv: number;
  newsletter: number;
  today: number;
  this_week: number;
  this_month: number;
}

export interface ContactOverviewStats {
  total_contacts: number;
  contacts_today: number;
  contacts_this_week: number;
  contacts_this_month: number;
  contacts_this_year: number;
  total_groups: number;
}

export interface SourceStats {
  [key: string]: number;
}

export interface MonthlyGrowth {
  month: string;
  contacts: number;
}

export interface GetContactsResponse {
  contacts: Contact[];
  pagination: PaginationMeta;
  stats: ContactStats;
}

export interface GetContactResponse {
  contact: Contact;
}

export interface CreateContactResponse {
  contact: Contact;
}

export interface UpdateContactResponse {
  contact: Contact;
}

export interface BulkDeleteContactsResponse {
  deleted_count: number;
}

export interface ImportCsvResponse {
  imported: number;
  skipped: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  email: string;
  error: string;
}

export interface GetGroupsResponse {
  groups: ContactGroup[];
}

export interface CreateGroupResponse {
  group: ContactGroup;
}

export interface GetContactStatsResponse {
  overview: ContactOverviewStats;
  sources: SourceStats;
  monthly_growth: MonthlyGrowth[];
}

// UI Types
export interface ContactFormData {
  email: string;
  name: string;
  groups: string[];
}

export interface CsvContact {
  email: string;
  name?: string;
  groups?: string[];
  isValid: boolean;
  error?: string;
}

export interface GroupOption {
  value: string;
  label: string;
  color?: string;
  count?: number;
}

export interface SourceOption {
  value: ContactSource | "";
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}
