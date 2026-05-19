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
import { useFindAllBrands } from "@/hooks/apis/use-brand"
import { useFindAllCategories } from "@/hooks/apis/use-category"
import { useCreateProduct, useUpdateProduct } from "@/hooks/apis/use-product"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "@/shared/dtos/req/product.dto"
import { ProductStatus } from "@/shared/enums/product-status.enum"
import { IProduct } from "@/shared/interfaces/models/product.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof CreateProductSchema> = {
  name: "",
  desc: "",
  brand: "",
  category: "",
  basePrice: 0,
  productImages: [],
  status: ProductStatus.DRAFT,
}

// Interface để quản lý các file mới được chọn kèm link preview của chúng
interface PreviewImage {
  file?: File
  url: string
}

export function ProductAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IProduct | null
  initialData?: IProduct | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateProduct()
  const updateApi = useUpdateProduct()
  const uploadApi = useUploadCloudinary()

  const { data: categoriesData } = useFindAllCategories()
  const categories = categoriesData?.metadata?.data || []
  const { data: brandsData } = useFindAllBrands()
  const brands = brandsData?.metadata?.data || []

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [previews, setPreviews] = useState<PreviewImage[]>([])

  const formSchema = !!dataEdit ? UpdateProductSchema : CreateProductSchema
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
        status: dataEdit.status,
        brand: dataEdit.brand.id,
        basePrice: dataEdit.basePrice,
        category: dataEdit.category.id,
        productImages: dataEdit.productImages || [],
      })

      // Nếu có ảnh cũ từ API, map vào danh sách preview
      if (dataEdit.productImages) {
        const existingImages = dataEdit.productImages.map((img) => ({
          url: img.url,
        })) as PreviewImage[]
        setPreviews(existingImages)
      }
    } else {
      form.reset(initFormValue)
      setPreviews([])
    }
  }, [dataEdit, form])

  // Theo dõi initialData
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
        brand: initialData.brand.id,
        category: initialData.category.id,
      })
    }
  }, [form, initialData])

  // Hàm xử lý khi chọn nhiều file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files)

      // Tạo object preview cho các file mới
      const newPreviews: PreviewImage[] = newFilesArray.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))

      // Cập nhật danh sách preview trên UI
      const updatedPreviews = [...previews, ...newPreviews]
      setPreviews(updatedPreviews)

      //
      const res = await uploadApi.mutateAsync({
        payload: { folder: "products" },
        file: newFilesArray[0] as File,
      })
      console.log("handleFileChange :::", res)
    }
  }

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

    // Cập nhật lại dữ liệu trong React Hook Form
    const currentImagesInForm = form.getValues("productImages") || []
    const updatedImagesInForm = currentImagesInForm.filter(
      (_, idx) => idx !== indexToRemove
    )
    form.setValue("productImages", updatedImagesInForm, {
      shouldValidate: true,
    })
  }

  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      // Dọn dẹp các blob URL khi đóng dialog để tránh tràn bộ nhớ
      previews.forEach((p) => p.file && URL.revokeObjectURL(p.url))
      onClose?.()
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: data,
        })
      } else {
        res = await createApi.mutateAsync(
          data as z.infer<typeof CreateProductSchema>
        )
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        setPreviews([])
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process product:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Product" : "Add New Product"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new product.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] space-y-6 overflow-x-hidden overflow-y-auto px-1"
        >
          {/* Khu vực Upload nhiều ảnh */}
          <FieldGroup>
            <FieldLabel htmlFor="form-rhf-input-store-image">
              Product Images
            </FieldLabel>
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
                id="form-rhf-input-store-image"
              />
            </div>
            {form.formState.errors.productImages && (
              <p className="text-destructive mt-1 text-sm">
                {form.formState.errors.productImages.message as string}
              </p>
            )}
          </FieldGroup>

          {/* Các trường thông tin khác giữ nguyên */}
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-name">
                    Product Name
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Product Name"
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
              name="status"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-status">Status</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        id="form-status"
                      >
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectGroup>
                          {Object.values(ProductStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
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

          <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
            <FieldGroup>
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-category">Category</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-category"
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent align="end">
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

            <FieldGroup>
              <Controller
                name="brand"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-brand">Brand</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-brand"
                        >
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectGroup>
                            {brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
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
          </div>

          <DialogFooterAction
            onClose={onClose}
            isPending={createApi.isPending || updateApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
