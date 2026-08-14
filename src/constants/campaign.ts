import { Globe, Mail, Users, UserCheck, FileText, Target } from "lucide-react";
import type {
  StatusOption,
  SortOption,
  RecipientModeOption,
} from "@/types/campaign";

export const CAMPAIGN_STATUS_OPTIONS: StatusOption[] = [
  { value: "", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sending", label: "Sending" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
];

export const CAMPAIGN_SORT_OPTIONS: SortOption[] = [
  { value: "created_at", label: "Date Created" },
  { value: "sent_at", label: "Date Sent" },
  { value: "name", label: "Campaign Name" },
  { value: "subject", label: "Subject" },
  { value: "total_recipients", label: "Recipients" },
];

export const RECIPIENT_MODE_OPTIONS: RecipientModeOption[] = [
  {
    id: "all",
    title: "All Contacts",
    description: "Send to all contacts and subscribers",
    icon: Globe,
  },
  {
    id: "newsletter",
    title: "WaitList Subscribers",
    description: "Send to WaitList Subscribers only",
    icon: Mail,
  },
  {
    id: "groups",
    title: "Contact Groups",
    description: "Send to specific contact groups",
    icon: Users,
  },
  {
    id: "manual",
    title: "Manual Selection",
    description: "Manually add email addresses",
    icon: UserCheck,
  },
];

export const CAMPAIGN_TABS = [
  { id: "compose", label: "Compose", icon: FileText },
  { id: "recipients", label: "Recipients", icon: Target },
] as const;

export const FREQUENCY_OPTIONS = [
  { value: "once", label: "Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

export const PER_PAGE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
] as const;

export const STATUS_COLORS = {
  draft: "bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-300",
  scheduled: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  sending: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
  sent: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  failed: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
} as const;

export const STATUS_LABELS = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
} as const;
