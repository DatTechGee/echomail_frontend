import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { templateService } from "@/services/api/template.services";
import type {
  CreateTemplateRequest,
  GetTemplatesRequest,
  UpdateTemplateRequest,
} from "@/types/template";

type TemplateQueryOptions = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof templateService.getTemplate>>>,
  "queryKey" | "queryFn"
>;

// Query Keys
export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (params?: GetTemplatesRequest) =>
    [...templateKeys.lists(), params] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (uuid: string) => [...templateKeys.details(), uuid] as const,
} as const;

export const useTemplates = (params?: GetTemplatesRequest) => {
  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () => templateService.getTemplates(params),
  });
};

export const useTemplate = (
  uuid: string | undefined,
  options?: TemplateQueryOptions
) => {
  return useQuery({
    queryKey: templateKeys.detail(uuid!),
    queryFn: () => templateService.getTemplate(uuid!),
    enabled: !!uuid,
    ...options,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateRequest) =>
      templateService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: UpdateTemplateRequest;
    }) => templateService.updateTemplate(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(uuid) });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => templateService.deleteTemplate(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
};
