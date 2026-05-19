import { cloudinaryServices } from "@/services/upload/cloudinary.service"
import { SignatureDto } from "@/shared/dtos/req/cloudinary.dto"
import { useMutation } from "@tanstack/react-query"

export const useSignatureCloudinary = () => {
  return useMutation({
    //
    mutationFn: (payload: SignatureDto) =>
      cloudinaryServices.signature(payload),

    //
    onSuccess: () => {},
    onError: () => {},
  })
}

export const useUploadCloudinary = () => {
  const signatureApi = useSignatureCloudinary()

  return useMutation({
    //
    mutationFn: async ({
      file,
      payload,
    }: {
      file: File
      payload: SignatureDto
    }) => {
      const resSignatureApi = await signatureApi.mutateAsync(payload)
      if (resSignatureApi?.statusCode !== 201 || !resSignatureApi.metadata) {
        throw new Error("Failed to get signature from server")
      }

      const { api_key, timestamp, signature, folder, cloud_name } =
        resSignatureApi.metadata

      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)
      formData.append("signature", signature)
      formData.append("api_key", api_key || "")
      formData.append("timestamp", timestamp.toString())

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) {
        throw new Error("Upload to Cloudinary failed")
      }

      return res.json()
    },

    //
    onSuccess: () => {},
    onError: () => {},
  })
}
