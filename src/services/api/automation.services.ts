import instance from "../instance";

export interface AutomationStep {
  step_type: "wait" | "send_email" | "condition" | "tag" | "end";
  step_config: Record<string, any>;
}

export interface CreateAutomationRequest {
  name: string;
  description?: string;
  trigger_type: "subscriber_joins" | "subscriber_tag" | "date_based" | "manual";
  trigger_config?: Record<string, any>;
  steps: AutomationStep[];
}

export const automationService = {
  list: (params?: { status?: string; search?: string; per_page?: number }) => {
    return instance.get("/automations", { params });
  },

  getStats: () => {
    return instance.get("/automations/stats");
  },

  getAutomation: (uuid: string) => {
    return instance.get(`/automations/${uuid}`);
  },

  create: (data: CreateAutomationRequest) => {
    return instance.post("/automations", data);
  },

  update: (uuid: string, data: Partial<CreateAutomationRequest>) => {
    return instance.put(`/automations/${uuid}`, data);
  },

  activate: (uuid: string) => {
    return instance.post(`/automations/${uuid}/activate`);
  },

  pause: (uuid: string) => {
    return instance.post(`/automations/${uuid}/pause`);
  },

  enroll: (uuid: string, data: { email: string; name?: string }) => {
    return instance.post(`/automations/${uuid}/enroll`, data);
  },

  getEnrollments: (uuid: string) => {
    return instance.get(`/automations/${uuid}/enrollments`);
  },

  delete: (uuid: string) => {
    return instance.delete(`/automations/${uuid}`);
  },
};
