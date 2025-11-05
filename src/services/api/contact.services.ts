/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONTACT_ENDPOINTS } from "../endpoints/contact";
import type {
  CreateContactRequest,
  UpdateContactRequest,
  GetContactsRequest,
  BulkDeleteContactsRequest,
  ImportCsvRequest,
  ExportContactsRequest,
  CreateGroupRequest,
  ApiResponse,
  GetContactsResponse,
  GetContactResponse,
  CreateContactResponse,
  UpdateContactResponse,
  BulkDeleteContactsResponse,
  ImportCsvResponse,
  GetGroupsResponse,
  CreateGroupResponse,
  GetContactStatsResponse,
} from "@/types/contact";
import instance from "../instance";

export const contactService = {
  // Contact CRUD operations
  getContacts: (params?: GetContactsRequest) => {
    return instance.get<ApiResponse<GetContactsResponse>>(
      CONTACT_ENDPOINTS.CONTACTS,
      { params }
    );
  },

  getContact: (uuid: string) => {
    return instance.get<ApiResponse<GetContactResponse>>(
      `${CONTACT_ENDPOINTS.CONTACT_DETAIL}/${uuid}`
    );
  },

  createContact: (data: CreateContactRequest) => {
    return instance.post<ApiResponse<CreateContactResponse>>(
      CONTACT_ENDPOINTS.CONTACTS,
      data
    );
  },

  updateContact: (uuid: string, data: UpdateContactRequest) => {
    return instance.put<ApiResponse<UpdateContactResponse>>(
      `${CONTACT_ENDPOINTS.CONTACT_DETAIL}/${uuid}`,
      data
    );
  },

  deleteContact: (uuid: string) => {
    return instance.delete<ApiResponse<{}>>(
      `${CONTACT_ENDPOINTS.CONTACT_DETAIL}/${uuid}`
    );
  },

  // Bulk operations
  bulkDeleteContacts: (data: BulkDeleteContactsRequest) => {
    return instance.delete<ApiResponse<BulkDeleteContactsResponse>>(
      CONTACT_ENDPOINTS.BULK_DELETE,
      { data }
    );
  },

  importCsv: (data: ImportCsvRequest) => {
    return instance.post<ApiResponse<ImportCsvResponse>>(
      CONTACT_ENDPOINTS.IMPORT_CSV,
      data
    );
  },

  exportContacts: (params?: ExportContactsRequest) => {
    if (params?.format === "csv") {
      return instance.get(CONTACT_ENDPOINTS.EXPORT, {
        params,
        responseType: "blob",
      });
    }
    return instance.get<ApiResponse<{ contacts: any[] }>>(
      CONTACT_ENDPOINTS.EXPORT,
      { params }
    );
  },

  // Group operations
  getGroups: () => {
    return instance.get<ApiResponse<GetGroupsResponse>>(
      CONTACT_ENDPOINTS.GROUPS
    );
  },

  createGroup: (data: CreateGroupRequest) => {
    return instance.post<ApiResponse<CreateGroupResponse>>(
      CONTACT_ENDPOINTS.GROUPS,
      data
    );
  },

  // Statistics
  getStats: () => {
    return instance.get<ApiResponse<GetContactStatsResponse>>(
      CONTACT_ENDPOINTS.STATS
    );
  },
};
