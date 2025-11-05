import { Users, Upload, UserPlus } from "lucide-react";
import type { SourceOption, SortOption, GroupOption } from "@/types/contact";

export const SOURCE_OPTIONS: SourceOption[] = [
  { value: "", label: "All Sources" },
  { value: "manual", label: "Manual" },
  { value: "csv", label: "CSV Import" },
  { value: "newsletter", label: "Newsletter" },
];

export const SORT_OPTIONS: SortOption[] = [
  { value: "added_at", label: "Date Added" },
  { value: "email", label: "Email" },
  { value: "name", label: "Name" },
  { value: "source", label: "Source" },
];

export const PER_PAGE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
] as const;

export const DEFAULT_GROUPS: GroupOption[] = [
  { value: "Customers", label: "Customers", color: "#10b981" },
  { value: "Prospects", label: "Prospects", color: "#f59e0b" },
  { value: "VIP", label: "VIP", color: "#8b5cf6" },
  { value: "Partners", label: "Partners", color: "#ef4444" },
  { value: "Newsletter", label: "Newsletter", color: "#3b82f6" },
];

export const CONTACT_TABS = [
  { id: "list", label: "Contact List", icon: Users },
  { id: "add", label: "Add Contact", icon: UserPlus },
  { id: "import", label: "Import CSV", icon: Upload },
] as const;

export const CSV_HEADERS = [
  "Email",
  "Name",
  "Groups",
  "Source",
  "Added Date",
] as const;

export const SOURCE_LABELS = {
  manual: "Manual",
  csv: "CSV Import",
  newsletter: "Newsletter",
} as const;

export const SOURCE_COLORS = {
  manual: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  csv: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  newsletter:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
} as const;
