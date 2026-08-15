import instance from "../instance";

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: "tls" | "ssl" | "none";
  from_address: string;
  from_name: string;
}

export interface ApiKey {
  id: number;
  name: string;
  key: string;
  permissions: string[];
  active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export const settingsService = {
  getSmtp: () => {
    return instance.get("/settings/smtp");
  },

  updateSmtp: (data: SmtpSettings) => {
    return instance.put("/settings/smtp", data);
  },

  testSmtp: (data: SmtpSettings & { to_email: string }) => {
    return instance.post("/settings/smtp/test", data);
  },

  testSmtpConnection: (data: Omit<SmtpSettings, "from_address" | "from_name">) => {
    return instance.post("/settings/smtp/test-connection", data);
  },

  listApiKeys: () => {
    return instance.get("/settings/api-keys");
  },

  createApiKey: (data: { name: string; permissions?: string[] }) => {
    return instance.post("/settings/api-keys", data);
  },

  toggleApiKey: (id: number) => {
    return instance.post(`/settings/api-keys/${id}/toggle`);
  },

  revokeApiKey: (id: number) => {
    return instance.delete(`/settings/api-keys/${id}`);
  },
};
