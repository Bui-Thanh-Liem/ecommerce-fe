import { BrandSelectInForm } from "@/components/select-in-form/brand"
import { CategorySelectInForm } from "@/components/select-in-form/category"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooterAction,
  DialogHeaderAction,
} from "@/components/ui/dialog"
import { Editor } from "@/components/ui/editor"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/apis/catalog/use-product"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "@/shared/dtos/req/product.dto"
import { ProductStatus } from "@/shared/enums/product-status.enum"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { PreviewImage } from "@/shared/interfaces/common/preview-image.interface"
import { IProduct } from "@/shared/interfaces/models/catalog/product.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, Plus, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const initFormValue: z.infer<typeof CreateProductSchema> = {
  name: "",
  desc: "",
  model: "",
  brand: "",
  category: "",
  basePrice: 0,
  productImages: [],
  discountPercent: 0,
  specifications: [],
  isFeatured: false,
  allowReview: true,
  width: 0,
  weight: 0,
  height: 0,
  length: 0,
  secondaryCategories: [],
  status: ProductStatus.DRAFT,
}

//
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

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [previews, setPreviews] = useState<PreviewImage[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit ? UpdateProductSchema : CreateProductSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Quản lý mảng specifications (Cấp cha)
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name,
        desc: dataEdit.desc,
        model: dataEdit.model,
        width: dataEdit.width,
        weight: dataEdit.weight,
        height: dataEdit.height,
        length: dataEdit.length,
        brand: dataEdit.brand.id,
        status: dataEdit.status,
        basePrice: dataEdit.basePrice,
        category: dataEdit.category.id,
        isFeatured: dataEdit.isFeatured,
        allowReview: dataEdit.allowReview,
        discountPercent: dataEdit.discountPercent,
        specifications: dataEdit.specifications || [],
        productImages:
          dataEdit.productImages?.map((img) => ({ image: img.image })) || [],
        secondaryCategories:
          dataEdit.secondaryCategories?.map((cat) => cat.id) || [],
      })

      // Nếu có ảnh cũ từ API, map vào danh sách preview
      if (dataEdit.productImages) {
        const existingImages = dataEdit.productImages.map((img) => ({
          url: img.image.url,
          key: img.image.key,
          provider: img.image.provider,
        }))

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviews(existingImages)
      }
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
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      setPreviews([])
      setSelectedFiles(null)
      form.reset(initFormValue)
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsPending(true)

    try {
      // Lọc ra những img không có key (tức là ảnh preview)
      const images: IImage[] = previews.filter((img) => img.key) || []

      // Nếu có file được chọn, tiến hành upload lên S3/Cloudinary
      if (selectedFiles && selectedFiles?.length > 0) {
        const uploadedImages = await Promise.all(
          selectedFiles.map((file) =>
            uploadApi.mutateAsync({
              file: file,
              payload: { folder: "product" },
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

      if (images && images.length <= 0) {
        toast.error("Images is required. Please select an image to upload.")
        return
      }

      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: {
            ...data,
            productImages: images.map((img) => ({ image: img })), // Chuyển đổi sang đúng format của API
          },
        })
      } else {
        res = await createApi.mutateAsync({
          ...data,
          productImages: images.map((img) => ({ image: img })), // Chuyển đổi sang đúng format của API
        } as z.infer<typeof CreateProductSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        setPreviews([])
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process product:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Product" : "Add New Product"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new product.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] space-y-6 overflow-x-hidden overflow-y-auto px-1"
        >
          {/* */}
          <FieldGroup className="gap-y-3">
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

          {/* */}
          <div className="grid grid-cols-4 gap-x-4">
            <FieldGroup>
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-status">Status</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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

            <FieldGroup>
              <Controller
                name="isFeatured"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-is-featured">
                      Is Featured
                    </FieldLabel>

                    <Switch
                      className="data-[state=checked]:bg-primary scale-90"
                      checked={field.value}
                      id="form-is-featured"
                      onCheckedChange={field.onChange}
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
                name="allowReview"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-is-allowReview">
                      Allow Reviews
                    </FieldLabel>

                    <Switch
                      className="data-[state=checked]:bg-primary scale-90"
                      checked={field.value}
                      id="form-is-allowReview"
                      onCheckedChange={field.onChange}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* */}
          <div className="grid grid-cols-4 gap-x-4">
            <FieldGroup className="col-span-3">
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

            <FieldGroup className="col-span-1">
              <Controller
                name="model"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-model">
                      Product Model
                    </FieldLabel>

                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Product Model"
                      autoComplete="name"
                      id="form-rhf-input-model"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/*  */}
          <div className="grid grid-cols-2 gap-x-4">
            {/* */}
            <CategorySelectInForm
              form={form}
              name="category"
              label="Category (main)"
            />

            {/* */}
            <BrandSelectInForm form={form} name="brand" label="Brand" />
          </div>

          {/* */}
          <CategorySelectInForm
            multiple
            form={form}
            name="secondaryCategories"
            label="Secondary Categories (support filtering)"
          />

          {/*  */}
          <div className="grid grid-cols-2 gap-x-4">
            <FieldGroup>
              <Controller
                name="basePrice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-basePrice">
                      Base Price
                    </FieldLabel>

                    <InputGroup>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        placeholder="Base Price"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber

                          if (isNaN(value)) {
                            field.onChange(0) // Nếu không phải số, đặt về 0
                          } else if (value < 0) {
                            field.onChange(0) // Không cho nhập số âm
                          } else {
                            field.onChange(value)
                          }
                        }}
                        id="form-rhf-input-basePrice"
                      />

                      <InputGroupAddon align="inline-end">VND</InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* */}
            <FieldGroup>
              <Controller
                name="discountPercent"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-discountPercent">
                      Discount Percent
                    </FieldLabel>

                    <InputGroup>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        placeholder="Discount Percent"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber

                          if (isNaN(value)) {
                            field.onChange(0) // Nếu không phải số, đặt về 0
                          } else if (value < 0) {
                            field.onChange(0) // Không cho nhập số âm
                          } else {
                            field.onChange(value)
                          }
                        }}
                        id="form-rhf-input-discountPercent"
                      />

                      <InputGroupAddon align="inline-end">%</InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/*  */}
          <div className="grid grid-cols-4 gap-x-4">
            <FieldGroup>
              <Controller
                name="weight"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-weight">
                      Weight
                    </FieldLabel>

                    <InputGroup>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        placeholder="Weight"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber

                          if (isNaN(value)) {
                            field.onChange(0) // Nếu không phải số, đặt về 0
                          } else if (value < 0) {
                            field.onChange(0) // Không cho nhập số âm
                          } else {
                            field.onChange(value)
                          }
                        }}
                        id="form-rhf-input-weight"
                      />

                      <InputGroupAddon align="inline-end">kg</InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="height"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-height">
                      Height
                    </FieldLabel>

                    <InputGroup>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        placeholder="Height"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber

                          if (isNaN(value)) {
                            field.onChange(0) // Nếu không phải số, đặt về 0
                          } else if (value < 0) {
                            field.onChange(0) // Không cho nhập số âm
                          } else {
                            field.onChange(value)
                          }
                        }}
                        id="form-rhf-input-height"
                      />

                      <InputGroupAddon align="inline-end">cm</InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="length"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-length">
                      Length
                    </FieldLabel>

                    <InputGroup>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        placeholder="Length"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber

                          if (isNaN(value)) {
                            field.onChange(0) // Nếu không phải số, đặt về 0
                          } else if (value < 0) {
                            field.onChange(0) // Không cho nhập số âm
                          } else {
                            field.onChange(value)
                          }
                        }}
                        id="form-rhf-input-length"
                      />

                      <InputGroupAddon align="inline-end">cm</InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="width"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-width">
                      Width
                    </FieldLabel>

                    <InputGroup>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        placeholder="Width"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber

                          if (isNaN(value)) {
                            field.onChange(0) // Nếu không phải số, đặt về 0
                          } else if (value < 0) {
                            field.onChange(0) // Không cho nhập số âm
                          } else {
                            field.onChange(value)
                          }
                        }}
                        id="form-rhf-input-width"
                      />

                      <InputGroupAddon align="inline-end">cm</InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* */}
          <div className="bg-muted/20 space-y-4 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-sm font-semibold">
                Specifications
              </h3>

              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() =>
                  appendSpec({
                    title: "",
                    items: [
                      {
                        key: "",
                        order: 0,
                        desc: "",
                        value: "",
                        label: "",
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-1 h-4 w-4" /> Add Group
              </Button>
            </div>

            <div className="space-y-4">
              {specFields.map((spec, specIdx) => (
                <div
                  key={spec.id}
                  className="bg-background relative space-y-3 rounded-2xl border p-3 shadow-sm"
                >
                  <div className="flex items-center gap-x-2">
                    <FieldGroup>
                      <Controller
                        name={`specifications.${specIdx}.title`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              placeholder="Group Title (e.g., Screen, Memory)"
                              className="font-medium"
                            />

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => removeSpec(specIdx)}
                      disabled={specFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Component xử lý mảng con Items */}
                  <SpecificationItems form={form as any} specIdx={specIdx} />
                </div>
              ))}
              {specFields.length === 0 && (
                <div className="text-muted-foreground border-muted-foreground/20 flex flex-col items-center justify-center rounded-2xl border border-dashed py-6 text-center text-xs">
                  <p>No attributes added yet.</p>
                  <p>Click Add Attribute to add technical details.</p>
                </div>
              )}
            </div>
          </div>

          <FieldGroup className="col-span-2">
            <Controller
              name="desc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-editor-desc">
                    Description
                  </FieldLabel>
                  <Editor
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter description here..."
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

// Component con xử lý danh sách Items cho từng Nhóm thông số
function SpecificationItems({
  form,
  specIdx,
}: {
  form: UseFormReturn<z.infer<typeof CreateProductSchema>>
  specIdx: number
}) {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: `specifications.${specIdx}.items`,
  })

  return (
    <div className="space-y-3">
      {/* Container bọc danh sách các item */}
      <div className="space-y-2.5">
        {itemFields.map((item, itemIdx) => (
          <div
            key={item.id}
            className="group border-muted-foreground/10 bg-muted/5 hover:border-muted-foreground/20 hover:bg-muted/10 relative space-y-3 rounded-2xl border p-3 text-xs transition-all duration-200"
          >
            {/* Hàng 1: Inputs cho Key, label, desc và Value + Nút Xóa */}
            <div className="flex items-start gap-2.5">
              <div className="grid flex-1 grid-cols-2 gap-2.5">
                <FieldGroup>
                  <Controller
                    name={`specifications.${specIdx}.items.${itemIdx}.key`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          placeholder="Key (e.g. screen)"
                          className="bg-background border-muted-foreground/20 focus-visible:ring-primary h-9 shadow-sm"
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
                    name={`specifications.${specIdx}.items.${itemIdx}.value`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          placeholder="Value (e.g. 32inch)"
                          className="bg-background border-muted-foreground/20 focus-visible:ring-primary h-9 shadow-sm"
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
                    name={`specifications.${specIdx}.items.${itemIdx}.label`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          placeholder="Label (e.g. Screen Size)"
                          className="bg-background border-muted-foreground/20 focus-visible:ring-primary h-9 shadow-sm"
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
                    name={`specifications.${specIdx}.items.${itemIdx}.desc`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          placeholder="Description (e.g. 32-inch LED display)"
                          className="bg-background border-muted-foreground/20 focus-visible:ring-primary h-9 shadow-sm"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <Button
                size="icon"
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0 transition-colors"
                onClick={() => removeItem(itemIdx)}
                disabled={itemFields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Đường ngăn cách mờ giữa 2 hàng nội bộ */}
            <div className="border-muted-foreground/5 my-1 border-t" />

            {/* Hàng 2: Toggle Highlight & Ô Order */}
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-x-2.5">
                <Controller
                  name={`specifications.${specIdx}.items.${itemIdx}.isHighlight`}
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      className="data-[state=checked]:bg-primary scale-90"
                      checked={field.value}
                      id={`sku-${specIdx}-${itemIdx}`}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />

                <label
                  htmlFor={`sku-${specIdx}-${itemIdx}`}
                  className="text-muted-foreground group-hover:text-foreground cursor-pointer font-medium transition-colors select-none"
                >
                  highlight?
                </label>
              </div>

              <div className="border-muted-foreground/10 bg-background flex items-center gap-x-2 rounded-xl border px-2 py-0.5 shadow-sm">
                <span className="text-muted-foreground text-[11px] font-medium tracking-wide">
                  Order:
                </span>

                <Controller
                  name={`specifications.${specIdx}.items.${itemIdx}.order`}
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      className="h-6 w-12 [appearance:textfield] border-none bg-transparent p-0 text-center font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút thêm dòng */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-primary/30 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary mt-1 h-9 w-full rounded-2xl border-dashed text-xs font-medium transition-all"
        onClick={() =>
          appendItem({
            key: "",
            order: 0,
            desc: "",
            value: "",
            label: "",
            isHighlight: false,
          })
        }
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add Item
      </Button>
    </div>
  )
}
