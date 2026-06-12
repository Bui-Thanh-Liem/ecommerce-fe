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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateMainBanner,
  useUpdateMainBanner,
} from "@/hooks/apis/catalog/use-main-banner"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateMainBannerSchema,
  UpdateMainBannerSchema,
} from "@/shared/dtos/req/main-banner.dto"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { IMainBanner } from "@/shared/interfaces/models/catalog/main-banner.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const initFormValue: z.infer<typeof CreateMainBannerSchema> = {
  title: "",
  desc: "",
  image: undefined,
  isActive: true,
}

export function MainBannerAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange,
}: {
  open: boolean
  onClose?: () => void
  initialData?: IMainBanner | null
  dataEdit: IMainBanner | null
  onOpenChange?: (open: boolean) => void
}) {
  //
  const createApi = useCreateMainBanner()
  const updateApi = useUpdateMainBanner()
  const uploadApi = useUploadCloudinary()

  //
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isPending, setIsPending] = useState(false)

  //
  const formSchema = !!dataEdit
    ? UpdateMainBannerSchema
    : CreateMainBannerSchema
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
        title: dataEdit.title,
        desc: dataEdit.desc || "",
        image: dataEdit.image,
        isActive: dataEdit.isActive,
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(dataEdit.image?.url || "")
    }
  }, [dataEdit, form])

  //
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
      })
    }
  }, [form, initialData])

  //
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      setPreviewUrl("")
      setSelectedFile(null)
      form.reset(initFormValue)
    }
  }

  //
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsPending(true)
    try {
      let image: IImage | undefined = dataEdit?.image

      // 1. Nếu có file được chọn, tiến hành upload lên S3/Cloudinary
      if (selectedFile) {
        const res = await uploadApi.mutateAsync({
          payload: { folder: "main-banner" },
          file: selectedFile,
        })

        if (res.url && res.public_id) {
          image = {
            url: res.url,
            key: res.public_id,
            provider: Provider.CLOUDINARY,
          }
        }
      }

      if (!image) {
        toast.error("Image is required. Please select an image to upload.")
        return
      }

      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: { ...data, image },
        })
      } else {
        res = await createApi.mutateAsync({ ...data, image } as z.infer<
          typeof CreateMainBannerSchema
        >)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to create main banner:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Main Banner" : "Add New Main Banner"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new main banner.`}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldGroup>
            <Controller
              name="isActive"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="form-isActive">Active</FieldLabel>
                    <Switch
                      id="form-isActive"
                      checked={field.value} // RHF lưu giá trị boolean
                      onCheckedChange={field.onChange} // Cập nhật lại giá trị vào RHF
                      aria-invalid={fieldState.invalid}
                    />
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="form-rhf-input-store-image">Image</FieldLabel>
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
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-title">Title</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="title"
                    autoComplete="title"
                    id="form-rhf-input-title"
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
              name="desc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-desc">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    rows={2}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter description here..."
                    id="form-rhf-textarea-desc"
                    className="resize-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooterAction onClose={onClose} isPending={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
