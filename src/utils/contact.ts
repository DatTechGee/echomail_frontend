import type { Contact, ContactSource, CsvContact } from "@/types/contact";
import { SOURCE_LABELS } from "@/constants/contact";

export const getSourceLabel = (source: ContactSource): string => {
  return SOURCE_LABELS[source] || source;
};

export const getSourceColor = (source: ContactSource): string => {
  const sourceColors = {
    manual: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    csv: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    newsletter:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  };
  return sourceColors[source] || "";
};

export const getContactInitials = (contact: Contact): string => {
  if (contact.name) {
    return contact.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  return contact.email[0].toUpperCase();
};

export const formatContactName = (contact: Contact): string => {
  return contact.name || "No name";
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

export const validateCsvContact = (contact: {
  email: string;
  name?: string;
  groups?: string[];
}): CsvContact => {
  const isValid = validateEmail(contact.email);

  return {
    email: contact.email,
    name: contact.name,
    groups: contact.groups || [],
    isValid,
    error: !isValid ? "Invalid email format" : undefined,
  };
};

export const parseCsvData = (csvText: string): CsvContact[] => {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const emailIndex = headers.findIndex((h) => h.includes("email"));
  const nameIndex = headers.findIndex((h) => h.includes("name"));
  const groupsIndex = headers.findIndex((h) => h.includes("group"));

  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      const email = values[emailIndex] || "";
      const name = nameIndex >= 0 ? values[nameIndex] || undefined : undefined;
      const groupsStr = groupsIndex >= 0 ? values[groupsIndex] || "" : "";
      const groups = groupsStr ? groupsStr.split(";").filter(Boolean) : [];

      return validateCsvContact({
        email,
        name,
        groups,
      });
    })
    .filter((contact) => contact.email);
};

export const generateCsvContent = (contacts: Contact[]): string => {
  const headers = ["Email", "Name", "Groups", "Source", "Added Date"];
  const rows = contacts.map((contact) => [
    contact.email,
    contact.name || "",
    (contact.groups || []).join(";"),
    getSourceLabel(contact.source),
    formatDate(contact.added_at),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");
};

export const downloadCsv = (
  csvContent: string,
  filename: string = "contacts.csv"
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

export const getGroupsFromContacts = (contacts: Contact[]): string[] => {
  const allGroups = contacts.flatMap((contact) => contact.groups || []);
  return [...new Set(allGroups)].sort();
};

export const filterContactsByGroup = (
  contacts: Contact[],
  groupName: string
): Contact[] => {
  if (groupName === "all") return contacts;
  return contacts.filter((contact) =>
    (contact.groups || []).includes(groupName)
  );
};

export const getContactsBySource = (contacts: Contact[]) => {
  return contacts.reduce(
    (acc, contact) => {
      acc[contact.source] = (acc[contact.source] || 0) + 1;
      return acc;
    },
    {} as Record<ContactSource, number>
  );
};

export const getContactGrowthTrend = (
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

export const isValidGroupName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 50;
};

export const generateGroupColor = (): string => {
  const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // yellow
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#ec4899", // pink
    "#6366f1", // indigo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
