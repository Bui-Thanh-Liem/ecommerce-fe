"use client"

import * as React from "react"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

import { Camera, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AvatarUploadProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  className?: string
}

export function AvatarUpload<T extends FieldValues>({
  form,
  name,
  className,
}: AvatarUploadProps<T>) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const value = form.watch(name)

  const [preview, setPreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const previewImage = preview || value

  const handleChooseFile = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl) // ← preview ngay lập tức

    try {
      setLoading(true)

      // TODO: thay bằng API thật sau
      const uploadData = await getPresignedUrl(file)

      // Nếu chưa implement upload thì comment tạm 2 dòng dưới
      // await uploadFileToS3(uploadData.uploadUrl, file)
      // form.setValue(name, uploadData.fileUrl as any, { shouldDirty: true, shouldValidate: true })

      // Test: giữ objectUrl lâu hơn
      // setPreview(objectUrl)
    } catch (error) {
      console.error(error)
      // Nếu lỗi thì revoke
      URL.revokeObjectURL(objectUrl)
    } finally {
      setLoading(false)
      // Chỉ revoke khi component unmount hoặc thay src khác
      // URL.revokeObjectURL(objectUrl)  ← tạm comment để test
    }
  }

  return (
    <div className={cn("relative w-fit", className)}>
      <button
        type="button"
        onClick={handleChooseFile}
        className="group relative"
      >
        <Avatar className="h-28 w-28 border">
          <AvatarImage src={previewImage} />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    APIs                                    */
/* -------------------------------------------------------------------------- */

interface PresignedUrlResponse {
  uploadUrl: string
  fileUrl: string
}

async function getPresignedUrl(file: File): Promise<PresignedUrlResponse> {
  // TODO:
  return {
    uploadUrl: "",
    fileUrl: "",
  }
}

async function uploadFileToS3(uploadUrl: string, file: File) {
  // TODO:
}
