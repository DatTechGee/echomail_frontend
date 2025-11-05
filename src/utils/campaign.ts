/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Campaign,
  CampaignStatus,
  CampaignPerformance,
} from "@/types/campaign";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants/campaign";

export const getStatusLabel = (status: CampaignStatus): string => {
  return STATUS_LABELS[status] || status;
};

export const getStatusColor = (status: CampaignStatus): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.draft;
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString();
};

export const calculateSuccessRate = (campaign: Campaign): number => {
  if (campaign.total_recipients === 0) return 0;
  return Math.round((campaign.total_sent / campaign.total_recipients) * 100);
};

export const calculateFailureRate = (campaign: Campaign): number => {
  if (campaign.total_recipients === 0) return 0;
  return Math.round((campaign.total_failed / campaign.total_recipients) * 100);
};

export const getCampaignPerformance = (
  campaign: Campaign
): CampaignPerformance => {
  return {
    total_recipients: campaign.total_recipients,
    total_sent: campaign.total_sent,
    total_failed: campaign.total_failed,
    success_rate: calculateSuccessRate(campaign),
    opens: campaign.opens,
    clicks: campaign.clicks,
    open_rate: campaign.open_rate,
    click_rate: campaign.click_rate,
  };
};

export const getPerformanceColor = (rate: number): string => {
  if (rate >= 25) return "text-green-600 dark:text-green-400";
  if (rate >= 15) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const getOpenRateColor = (rate: number): string => {
  return getPerformanceColor(rate);
};

export const getClickRateColor = (rate: number): string => {
  return getPerformanceColor(rate);
};

export const validateCampaignName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 255;
};

export const validateCampaignSubject = (subject: string): boolean => {
  return subject.trim().length >= 3 && subject.trim().length <= 255;
};

export const validateCampaignContent = (content: string): boolean => {
  return content.trim().length >= 10;
};

export const validateEmailList = (
  emails: string[]
): { valid: string[]; invalid: string[] } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];

  emails.forEach((email) => {
    const trimmedEmail = email.trim();
    if (emailRegex.test(trimmedEmail)) {
      valid.push(trimmedEmail);
    } else {
      invalid.push(trimmedEmail);
    }
  });

  return { valid, invalid };
};

export const formatRecipientCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

export const getCampaignStatusIcon = (status: CampaignStatus) => {
  const iconMap = {
    draft: "📝",
    sent: "✅",
    failed: "❌",
  };
  return iconMap[status] || "📄";
};

export const calculateEstimatedSendTime = (recipientCount: number): string => {
  // Assuming ~100 emails per minute on shared hosting
  const emailsPerMinute = 100;
  const minutes = Math.ceil(recipientCount / emailsPerMinute);

  if (minutes < 1) return "< 1 minute";
  if (minutes < 60) return `~${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes > 0
      ? `~${hours}h ${remainingMinutes}m`
      : `~${hours} hours`;
  }

  const days = Math.floor(hours / 24);
  return `~${days} days`;
};

export const parseCampaignContent = (content: string): any => {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
};

export const stringifyCampaignContent = (content: any): string => {
  try {
    return JSON.stringify(content);
  } catch {
    return "";
  }
};
