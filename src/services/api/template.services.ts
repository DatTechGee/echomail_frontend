/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEMPLATE_ENDPOINTS } from "../endpoints/template";
import type {
  CreateTemplateRequest,
  GetTemplatesRequest,
  UpdateTemplateRequest,
} from "@/types/template";
import type { ApiResponse } from "@/types/campaign";
import instance from "../instance";

export const templateService = {
  getTemplates: (params?: GetTemplatesRequest) => {
    return instance.get<ApiResponse<any>>(TEMPLATE_ENDPOINTS.TEMPLATES, {
      params,
    });
  },

  getTemplate: (uuid: string) => {
    return instance.get<ApiResponse<any>>(
      `${TEMPLATE_ENDPOINTS.TEMPLATE_DETAIL}/${uuid}`
    );
  },

  createTemplate: (data: CreateTemplateRequest) => {
    return instance.post<ApiResponse<any>>(TEMPLATE_ENDPOINTS.TEMPLATES, data);
  },

  updateTemplate: (uuid: string, data: UpdateTemplateRequest) => {
    return instance.put<ApiResponse<any>>(
      `${TEMPLATE_ENDPOINTS.TEMPLATE_DETAIL}/${uuid}`,
      data
    );
  },

  deleteTemplate: (uuid: string) => {
    return instance.delete<ApiResponse<{}>>(
      `${TEMPLATE_ENDPOINTS.TEMPLATE_DETAIL}/${uuid}`
    );
  },
};
