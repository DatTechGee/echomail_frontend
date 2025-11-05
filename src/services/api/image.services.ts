import type {
  UploadImageRequest,
  ApiResponse,
  UploadImageResponse,
} from "@/types/image";
import instance from "../instance";
import { IMAGE_ENDPOINTS } from "../endpoints/mage";

export const imageService = {
  uploadImage: (data: UploadImageRequest) => {
    const formData = new FormData();
    formData.append("file", data.file);

    return instance.post<ApiResponse<UploadImageResponse>>(
      IMAGE_ENDPOINTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
