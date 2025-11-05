export const CONTACT_ENDPOINTS = {
  // Contact CRUD
  CONTACTS: "/contacts",
  CONTACT_DETAIL: "/contacts", // + /{uuid}

  // Bulk operations
  BULK_DELETE: "/contacts/bulk-delete",
  IMPORT_CSV: "/contacts/import-csv",
  EXPORT: "/contacts/export",

  // Groups
  GROUPS: "/contacts/groups",

  // Statistics
  STATS: "/contacts/stats",
} as const;
