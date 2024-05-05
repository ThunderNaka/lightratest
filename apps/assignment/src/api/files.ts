import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";

export interface UploadFile {
  url: string;
}

export const uploadFile = {
  mutation: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await getApi().post<ServiceResponse<UploadFile>>(
      "/images",
      formData,
      { headers: { "Content-Type": file.type } },
    );
    return response.data;
  },
};
