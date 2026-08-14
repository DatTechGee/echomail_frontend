import type { NewsletterSource, NewsletterStatus } from "@/types/newsletter";

export const getSourceLabel = (source: NewsletterSource): string => {
  const sourceLabels = {
    website: "Company Website",
    social: "Social Media",
    search: "Search Engine",
    referral: "Friend Referral",
    advertising: "Online Advertisement",
    blog: "Blog/Article",
    other: "Other",
  };
  return sourceLabels[source] || source;
};

export const getStatusLabel = (status: NewsletterStatus): string => {
  const statusLabels = {
    pending: "Pending",
    active: "Active",
    unsubscribed: "Unsubscribed",
  };
  return statusLabels[status] || status;
};

export const getStatusColor = (status: NewsletterStatus): string => {
  const statusColors = {
    pending:
      "text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30",
    active:
      "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/30",
    unsubscribed:
      "text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-900/30",
  };
  return statusColors[status] || "";
};

export const generateShareableLink = (baseUrl?: string): string => {
  const url = baseUrl || window.location.origin;
  return `${url}/join-newsletters`;
};

export const downloadCSV = (
  csvContent: string,
  filename: string = "newsletter-subscribers.csv"
) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const formatSubscriberName = (subscriber: {
  name?: string | null;
  email: string;
}): string => {
  return subscriber.name || "No name";
};

export const getSubscriberInitials = (subscriber: {
  name?: string | null;
  email: string;
}): string => {
  if (subscriber.name) {
    return subscriber.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  return subscriber.email[0].toUpperCase();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getSubscriptionTrend = (
  currentCount: number,
  previousCount: number
): {
  percentage: number;
  isPositive: boolean;
  isNeutral: boolean;
} => {
  if (previousCount === 0) {
    return {
      percentage: currentCount > 0 ? 100 : 0,
      isPositive: currentCount > 0,
      isNeutral: currentCount === 0,
    };
  }

  const percentage = ((currentCount - previousCount) / previousCount) * 100;
  return {
    percentage: Math.abs(percentage),
    isPositive: percentage > 0,
    isNeutral: percentage === 0,
  };
};
