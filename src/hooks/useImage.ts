import { useMutation } from "@tanstack/react-query";
import { imageService } from "@/services/api/image.services";
import type { UploadImageRequest } from "@/types/image";

export const imageKeys = {
  all: ["images"] as const,
  uploads: () => [...imageKeys.all, "upload"] as const,
} as const;

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (data: UploadImageRequest) => imageService.uploadImage(data),
  });
};
