export interface Image {
  id: number;
  filename: string;
  path: string;
  created_at: string;
  updated_at: string;
}

export interface UploadImageRequest {
  file: File;
}

export interface UploadImageResponse {
  filename: string;
  path: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
