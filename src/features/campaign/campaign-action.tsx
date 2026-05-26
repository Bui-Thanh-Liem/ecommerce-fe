import { Button } from "@/components/ui/button"
import { DatePickerTime } from "@/components/ui/date-time-picker"
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
import { useCreateCampaign, useUpdateCampaign } from "@/hooks/apis/use-campaign"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateCampaignSchema,
  UpdateCampaignSchema,
} from "@/shared/dtos/req/campaign.dto"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { PreviewImage } from "@/shared/interfaces/common/preview-image.interface"
import { ICampaign } from "@/shared/interfaces/models/campaign.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const initFormValue: z.infer<typeof CreateCampaignSchema> = {
  name: "",
  desc: "",
  images: [],
  isActive: false,
  promotions: [],
  startDate: new Date(),
  endDate: new Date(),
  mainImage: undefined,
}

//
export function CampaignAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: ICampaign | null
  initialData?: ICampaign | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateCampaign()
  const updateApi = useUpdateCampaign()
  const uploadApi = useUploadCloudinary()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [previews, setPreviews] = useState<PreviewImage[]>([])
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit ? UpdateCampaignSchema : CreateCampaignSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name,
        desc: dataEdit.desc,
        images: dataEdit.images,
        isActive: dataEdit.isActive,
        mainImage: dataEdit.mainImage,
        startDate: new Date(dataEdit.startDate),
        endDate: new Date(dataEdit.endDate),
        promotions: dataEdit?.promotions?.map((promo) => promo.id),
      })

      // Nếu có ảnh cũ từ API, map vào danh sách preview
      if (dataEdit.images) {
        const existingImages = dataEdit.images.map((img) => ({
          url: img.url,
          key: img.key,
          provider: img.provider,
        }))

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviews(existingImages)
      }
      if (dataEdit.mainImage) {
        const existingMainImage = dataEdit.mainImage
        setPreviewUrl(existingMainImage.url)
      }
    }
  }, [dataEdit, form])

  // Theo dõi initialData
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
        promotions: initialData.promotions.map((promo) => promo.id),
      })
    }
  }, [form, initialData])

  // Hàm xóa ảnh (xóa cả ảnh cũ hoặc ảnh vừa thêm)
  const handleRemoveImage = (indexToRemove: number) => {
    const itemToRemove = previews[indexToRemove]

    // Revoke URL để tránh rò rỉ bộ nhớ nếu đó là file local blob
    if (itemToRemove.file) {
      URL.revokeObjectURL(itemToRemove.url)
    }

    // Cập nhật lại UI previews
    const updatedPreviews = previews.filter((_, idx) => idx !== indexToRemove)
    setPreviews(updatedPreviews)
    setSelectedFiles((prev) => {
      if (!prev) return null
      const newFiles = prev.filter((_, idx) => idx !== indexToRemove)
      return newFiles.length > 0 ? newFiles : null
    })

    // Cập nhật lại dữ liệu trong React Hook Form
    const currentImagesInForm = form.getValues("images") || []
    const updatedImagesInForm = currentImagesInForm.filter(
      (_, idx) => idx !== indexToRemove
    )

    form.setValue("images", updatedImagesInForm, {
      shouldValidate: true,
    })
  }

  // Hàm xử lý khi chọn nhiều file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files && files.length > 0) {
      // Giới hạn số lượng file được chọn (ví dụ: tối đa 6 ảnh)
      if (files.length > 6) toast.error("You can only select up to 6 images.")

      //
      const newFilesArray = Array.from(files).slice(0, 6) // Lấy tối đa 6 file

      setSelectedFiles(newFilesArray)

      // Tạo object preview cho các file mới
      const newPreviews: PreviewImage[] = newFilesArray.map((file) => ({
        file,
        key: "",
        provider: Provider.CLOUDINARY,
        url: URL.createObjectURL(file),
      }))

      // Cập nhật danh sách preview trên UI
      const updatedPreviews = [...previews, ...newPreviews]

      setPreviews(updatedPreviews)
    }
  }

  //
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      form.reset(initFormValue)
      setPreviewUrl("")
      setPreviews([])
      setSelectedFile(null)
      setSelectedFiles(null)
    }
  }

  //
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsPending(true)

    try {
      // Lọc ra những img không có key (tức là ảnh preview)
      let mainImage: IImage | undefined = dataEdit?.mainImage
      const images: IImage[] = previews.filter((img) => img.key) || []

      // Nếu có file được chọn, tiến hành upload lên S3/Cloudinary
      if (selectedFiles && selectedFiles?.length > 0) {
        const uploadedImages = await Promise.all(
          selectedFiles.map((file) =>
            uploadApi.mutateAsync({
              file: file,
              payload: { folder: "campaign-images" },
            })
          )
        )

        if (uploadedImages && uploadedImages.length > 0) {
          const newImages: IImage[] = uploadedImages.map((res) => ({
            url: res.url,
            key: res.public_id,
            provider: Provider.CLOUDINARY,
          }))

          images.push(...newImages)
        }
      }

      if (selectedFile) {
        const res = await uploadApi.mutateAsync({
          payload: { folder: "campaign-main-image" },
          file: selectedFile,
        })

        if (res.url && res.public_id) {
          mainImage = {
            url: res.url,
            key: res.public_id,
            provider: Provider.CLOUDINARY,
          }
        }
      }

      if (images && images.length <= 0) {
        toast.error("Images is required. Please select an image to upload.")
        return
      }

      if (!mainImage) {
        toast.error("Main image is required. Please select an image to upload.")
        return
      }

      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: {
            ...data,
            images,
            mainImage,
          },
        })
      } else {
        res = await createApi.mutateAsync({
          ...data,
          images,
          mainImage,
        } as z.infer<typeof CreateCampaignSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process campaign:", error)
    } finally {
      setIsPending(false)
    }
  }

  console.log("Erorr :::", form.formState.errors)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Campaign" : "Add New Campaign"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new campaign.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-2 space-y-6">
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

            {/* Main Image */}
            <FieldGroup className="gap-y-3">
              <FieldLabel htmlFor="form-rhf-input-main-image">
                Main Image
              </FieldLabel>
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
                  onChange={handleMainImageChange}
                  id="form-rhf-input-main-image"
                />
              </div>
            </FieldGroup>

            {/* Images */}
            <FieldGroup className="gap-y-3">
              <FieldLabel htmlFor="form-rhf-input-images">Images</FieldLabel>

              <div className="flex flex-col gap-4 rounded-lg border-2 border-dashed p-4">
                {/* Grid hiển thị danh sách ảnh đã chọn */}
                {previews.length > 0 && (
                  <div className="grid w-full grid-cols-3 gap-3">
                    {previews.map((item, index) => (
                      <div
                        key={index}
                        className="relative h-28 w-full overflow-hidden rounded-md border"
                      >
                        <Image
                          fill
                          alt={`Preview ${index + 1}`}
                          src={item.url}
                          className="h-full w-full object-cover"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nút click/drag chọn ảnh */}
                <div className="flex w-full flex-col items-center py-2 text-center">
                  <ImageIcon className="text-muted-foreground/50 h-8 w-8" />

                  <p className="text-muted-foreground mt-1 text-xs">
                    Click to select multiple images
                  </p>
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  multiple // Kích hoạt chọn nhiều file cùng lúc
                  className="cursor-pointer"
                  onChange={handleFileChange}
                  id="form-rhf-input-images"
                />
              </div>

              {form.formState.errors.images && (
                <p className="text-destructive mt-1 text-sm">
                  {form.formState.errors.images.message as string}
                </p>
              )}
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-start-date">
                      Start Date
                    </FieldLabel>

                    <DatePickerTime
                      id="form-rhf-input-start-date"
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
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
                name="endDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-end-date">
                      End Date
                    </FieldLabel>

                    <DatePickerTime
                      id="form-rhf-input-end-date"
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
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
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-name">Name</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Name"
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
          </div>
          <DialogFooterAction onClose={onClose} isPending={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
