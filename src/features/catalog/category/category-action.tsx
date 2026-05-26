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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateCategory,
  useFindAllCategories,
  useUpdateCategory,
} from "@/hooks/apis/use-category"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/shared/dtos/req/category.dto"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { ICategory } from "@/shared/interfaces/models/category.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const initFormValue: z.infer<typeof CreateCategorySchema> = {
  name: "",
  desc: "",
  image: undefined,
  parent: undefined,
}

export function CategoryAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange,
}: {
  open: boolean
  onClose?: () => void
  initialData?: ICategory | null
  dataEdit: ICategory | null
  onOpenChange?: (open: boolean) => void
}) {
  //
  const createApi = useCreateCategory()
  const updateApi = useUpdateCategory()
  const uploadApi = useUploadCloudinary()

  //
  const { data: categoryData } = useFindAllCategories()
  const categories = categoryData?.metadata?.data || []

  //
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isPending, setIsPending] = useState(false)

  //
  const formSchema = !!dataEdit ? UpdateCategorySchema : CreateCategorySchema
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
        name: dataEdit.name,
        image: dataEdit.image,
        desc: dataEdit.desc || "",
        parent: dataEdit.parent?.id,
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(dataEdit.image?.url || "")
    }
  }, [dataEdit, form])

  //
  useEffect(() => {
    if (initialData) {
      const parent = initialData.parent
      if (!parent) return

      form.reset({
        ...initFormValue,
        parent: initialData?.id,
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
          payload: { folder: "category" },
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
          typeof CreateCategorySchema
        >)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to create category:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Category" : "Add New Category"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new category.`}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
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

          <FieldGroup>
            <Controller
              name="parent"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-parent">
                      Parent Category
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        size="sm"
                        id="form-leader"
                      >
                        <SelectValue placeholder="Select a leader" />
                      </SelectTrigger>
                      <SelectContent align="end" className="z-3000">
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <DialogFooterAction onClose={onClose} isPending={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
