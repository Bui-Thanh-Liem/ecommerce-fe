import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooterAction,
  DialogHeaderAction,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCreateBrand, useUpdateBrand } from "@/hooks/apis/use-brand"
import {
  CreateBrandSchema,
  UpdateBrandSchema,
} from "@/shared/dtos/req/brand.dto"
import { IBrand } from "@/shared/interfaces/models/brand.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof CreateBrandSchema> = {
  name: "",
  logoUrl: "",
  country: "",
}

export function BrandAction({
  open,
  onClose,
  dataEdit,
  onOpenChange,
}: {
  open: boolean
  onClose?: () => void
  dataEdit: IBrand | null
  onOpenChange?: (open: boolean) => void
}) {
  //
  const createApi = useCreateBrand()
  const updateApi = useUpdateBrand()

  //
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  //
  const formSchema = !!dataEdit ? UpdateBrandSchema : CreateBrandSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Hàm xử lý khi chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file) // Tạo link preview tạm thời
      setPreviewUrl(url)
    }
  }

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name || "",
        logoUrl: dataEdit.logoUrl || "",
        country: dataEdit.country || "",
      })
    } else {
      form.reset(initFormValue)
    }
  }, [dataEdit, form])

  //
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
    }
  }

  //
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      let logoUrl = ""

      // 1. Nếu có file được chọn, tiến hành upload lên S3
      if (selectedFile) {
        // Giả sử bạn có hàm uploadToS3 đã viết ở câu trước
        logoUrl = await uploadToS3(selectedFile)
      }
      console.log("logoUrl after upload :::", logoUrl)

      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: { ...data, logoUrl },
        })
      } else {
        res = await createApi.mutateAsync({ ...data, logoUrl } as z.infer<
          typeof CreateBrandSchema
        >)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to create brand:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Brand" : "Add New Brand"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new brand.`}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldGroup>
            <FieldLabel htmlFor="form-rhf-input-store-image">Logo</FieldLabel>
            <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-4">
              {previewUrl ? (
                <div className="relative h-40 w-full overflow-hidden rounded-md border">
                  <Image
                    fill
                    alt="Preview"
                    src={previewUrl}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <ImageIcon className="text-muted-foreground/50 h-10 w-10" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Click or drag to select image
                  </p>
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={handleFileChange}
                id="form-rhf-input-store-image"
              />
            </div>
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-name">Name</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="name"
                    autoComplete="name"
                    id="form-rhf-input-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-country">
                    Country
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="country"
                    autoComplete="country"
                    id="form-rhf-input-country"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooterAction
            onClose={onClose}
            isPending={createApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Hàm giả định để upload file lên server/S3 của bạn
async function uploadToS3(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload", {
    // Thay bằng endpoint thật của bạn
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return data.url || "url-default" // Trả về link S3
}
