import {
  Globe,
  Share2,
  Search,
  Users,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import type { SourceOption } from "@/types/newsletter";

export const SOURCE_OPTIONS: SourceOption[] = [
  { value: "", label: "All Sources" },
  { value: "website", label: "Company Website", icon: Globe },
  { value: "social", label: "Social Media", icon: Share2 },
  { value: "search", label: "Search Engine", icon: Search },
  { value: "referral", label: "Friend Referral", icon: Users },
  { value: "advertising", label: "Online Advertisement", icon: ExternalLink },
  { value: "blog", label: "Blog/Article", icon: MessageSquare },
  { value: "other", label: "Other", icon: MessageSquare },
];

export const SUBSCRIPTION_SOURCE_OPTIONS: SourceOption[] = [
  { value: "", label: "How did you find us?" },
  { value: "website", label: "Company Website", icon: Globe },
  { value: "social", label: "Social Media", icon: Share2 },
  { value: "search", label: "Search Engine", icon: Search },
  { value: "referral", label: "Friend Referral", icon: Users },
  { value: "advertising", label: "Online Advertisement", icon: ExternalLink },
  { value: "blog", label: "Blog/Article", icon: MessageSquare },
  { value: "other", label: "Other", icon: MessageSquare },
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "unsubscribed", label: "Unsubscribed" },
] as const;

export const SORT_OPTIONS = [
  { value: "subscribed_at", label: "Subscription Date" },
  { value: "email", label: "Email" },
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
  { value: "source", label: "Source" },
] as const;

export const PER_PAGE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
] as const;
