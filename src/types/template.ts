export interface CampaignTemplate {
  uuid: string;
  name: string;
  subject: string;
  content?: string;
  html_content?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  content: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  subject?: string;
  content?: string;
}

export interface GetTemplatesRequest {
  search?: string;
  per_page?: number;
  page?: number;
}

export interface TemplatePaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface GetTemplatesResponse {
  templates: CampaignTemplate[];
  pagination: TemplatePaginationMeta;
}
