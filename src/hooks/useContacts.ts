import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactService } from "@/services/api/contact.services";
import type {
  CreateContactRequest,
  UpdateContactRequest,
  GetContactsRequest,
  BulkDeleteContactsRequest,
  ImportCsvRequest,
  ExportContactsRequest,
  CreateGroupRequest,
} from "@/types/contact";

// Query Keys
export const contactKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (params?: GetContactsRequest) =>
    [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all, "detail"] as const,
  detail: (uuid: string) => [...contactKeys.details(), uuid] as const,
  groups: () => [...contactKeys.all, "groups"] as const,
  stats: () => [...contactKeys.all, "stats"] as const,
} as const;

// Contact CRUD hooks
export const useContacts = (params?: GetContactsRequest) => {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => contactService.getContacts(params),
  });
};

export const useContact = (uuid: string) => {
  return useQuery({
    queryKey: contactKeys.detail(uuid),
    queryFn: () => contactService.getContact(uuid),
    enabled: !!uuid,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactRequest) =>
      contactService.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
      queryClient.invalidateQueries({ queryKey: contactKeys.groups() });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: UpdateContactRequest;
    }) => contactService.updateContact(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(uuid) });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
      queryClient.invalidateQueries({ queryKey: contactKeys.groups() });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => contactService.deleteContact(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
      queryClient.invalidateQueries({ queryKey: contactKeys.groups() });
    },
  });
};

// Bulk operations hooks
export const useBulkDeleteContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkDeleteContactsRequest) =>
      contactService.bulkDeleteContacts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
      queryClient.invalidateQueries({ queryKey: contactKeys.groups() });
    },
  });
};

export const useImportCsv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportCsvRequest) => contactService.importCsv(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
      queryClient.invalidateQueries({ queryKey: contactKeys.groups() });
    },
  });
};

export const useExportContacts = () => {
  return useMutation({
    mutationFn: (params?: ExportContactsRequest) =>
      contactService.exportContacts(params),
  });
};

// Group hooks
export const useContactGroups = () => {
  return useQuery({
    queryKey: contactKeys.groups(),
    queryFn: () => contactService.getGroups(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateContactGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => contactService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.groups() });
    },
  });
};

// Statistics hooks
export const useContactStats = () => {
  return useQuery({
    queryKey: contactKeys.stats(),
    queryFn: () => contactService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Utility hook for refreshing contact data
export const useRefreshContactData = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: contactKeys.all });
  };
};
