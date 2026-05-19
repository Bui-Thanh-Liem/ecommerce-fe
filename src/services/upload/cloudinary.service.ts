import { SignatureDto } from "@/shared/dtos/req/cloudinary.dto"
import { ResSignatureCloudinaryDto } from "@/shared/dtos/res/signature-cloudinary.dto"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const cloudinaryServices = {
  signature: async (payload: SignatureDto) => {
    const res = await apiCall<ResSignatureCloudinaryDto>(
      "/cloudinary/signature",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    )

    return handleResponse<ResSignatureCloudinaryDto>(res)
  },
}
