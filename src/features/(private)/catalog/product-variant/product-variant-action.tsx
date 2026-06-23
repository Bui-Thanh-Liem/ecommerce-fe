import { ProductSelectInForm } from "@/components/select-in-form/product-SPU"
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
  useCreateProductVariant,
  useUpdateProductVariant,
} from "@/hooks/apis/catalog/use-product-variant"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateProductVariantSchema,
  UpdateProductVariantSchema,
} from "@/shared/dtos/req/product-variant.dto"
import { ProductVariantCondition } from "@/shared/enums/product-variant-condition.enum"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { PreviewImage } from "@/shared/interfaces/common/preview-image.interface"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, Plus, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const initFormValue: z.infer<typeof CreateProductVariantSchema> = {
  vat: 0,
  price: 0,
  barcode: "",
  product: "",
  costPrice: 0,
  productImages: [],
  discountPercent: 0,
  salesAttributes: [],
  conditions: ProductVariantCondition.NEW,
}

//
export function ProductVariantAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IProductVariant | null
  initialData?: IProductVariant | null
  onOpenChange?: (open: boolean) => void
}) {
  const router = useRouter()

  //
  const createApi = useCreateProductVariant()
  const updateApi = useUpdateProductVariant()
  const uploadApi = useUploadCloudinary()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [previews, setPreviews] = useState<PreviewImage[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit
    ? UpdateProductVariantSchema
    : CreateProductVariantSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Quản lý mảng salesAttributes (Cấp cha)
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control: form.control,
    name: "salesAttributes",
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        vat: dataEdit.vat || 0,
        price: dataEdit.price || 0,
        barcode: dataEdit.barcode || "",
        costPrice: dataEdit.costPrice || 0,
        product: dataEdit.product.id,
        conditions: dataEdit.conditions,
        discountPercent: dataEdit.discountPercent || 0,
        salesAttributes: dataEdit.salesAttributes || [],
        productImages:
          dataEdit.productImages?.map((img) => ({ image: img.image })) || [], // Map lại format để đưa vào form
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
        product: initialData.product.id,
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
              payload: { folder: "product-variant" },
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
        } as z.infer<typeof CreateProductVariantSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        setPreviews([])
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process product variant:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeaderAction
          title={
            !!dataEdit ? "Edit Product Variant" : "Add New Product Variant"
          }
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new product variant.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-4 space-y-6">
            {/* */}
            <FieldGroup className="gap-y-3">
              <FieldLabel htmlFor="form-rhf-input-store-image">
                Product variant Images
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
            <ProductSelectInForm
              form={form}
              name="product"
              label="Product"
              multiple={false}
            />

            {/* */}
            <div className="grid grid-cols-2 gap-x-4">
              <FieldGroup>
                <Controller
                  name="conditions"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-conditions">
                          Conditions
                        </FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                            id="form-conditions"
                          >
                            <SelectValue placeholder="Select conditions" />
                          </SelectTrigger>

                          <SelectContent align="end">
                            <SelectGroup>
                              {Object.values(ProductVariantCondition).map(
                                (status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                )
                              )}
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
                  name="barcode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-barcode">
                        Barcode
                      </FieldLabel>

                      <Input
                        {...field}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Barcode"
                        autoComplete="name"
                        id="form-rhf-input-barcode"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <div className="grid grid-cols-4 gap-x-2">
              {/*  */}
              <FieldGroup>
                <Controller
                  name="costPrice"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-cost-price">
                        Cost Price
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Cost Price"
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
                          id="form-rhf-input-cost-price"
                        />

                        <InputGroupAddon align="inline-end">
                          VND
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/*  */}
              <FieldGroup>
                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-price">
                        Price
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Price"
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
                          id="form-rhf-input-price"
                        />

                        <InputGroupAddon align="inline-end">
                          VND
                        </InputGroupAddon>
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

              {/*  */}
              <FieldGroup>
                <Controller
                  name="vat"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-vat">VAT</FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="VAT"
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
                          id="form-rhf-input-vat"
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

            {/* */}
            <div className="bg-muted/20 space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-foreground text-sm font-semibold">
                    Specifications (Sales Attributes)
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Add technical attributes for this variant.
                  </p>
                </div>

                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendSpec({
                      key: "",
                      label: "",
                      desc: "",
                      order: 0,
                      value: "",
                      isSKU: false,
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Attribute
                </Button>
              </div>

              <div className="space-y-3">
                {specFields.map((spec, specIdx) => (
                  <div
                    key={spec.id}
                    className="bg-background group border-muted-foreground/10 hover:border-muted-foreground/20 relative space-y-3 rounded-xl border p-3 shadow-sm transition-all duration-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="grid flex-1 grid-cols-2 gap-2">
                          {/* Input cho Key */}
                          <FieldGroup>
                            <Controller
                              name={`salesAttributes.${specIdx}.key`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <Input
                                    {...field}
                                    placeholder="Key (e.g., disk)"
                                    className="h-9 text-xs"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          {/* Input cho Value */}
                          <FieldGroup>
                            <Controller
                              name={`salesAttributes.${specIdx}.value`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <Input
                                    {...field}
                                    placeholder="Value (e.g., 256GB)"
                                    className="h-9 text-xs"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          {/* Input cho Label */}
                          <FieldGroup>
                            <Controller
                              name={`salesAttributes.${specIdx}.label`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <Input
                                    {...field}
                                    placeholder="Label (e.g., Disk)"
                                    className="h-9 text-xs"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          {/* Input for Description */}
                          <FieldGroup>
                            <Controller
                              name={`salesAttributes.${specIdx}.desc`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <Input
                                    {...field}
                                    placeholder="Description (e.g., 256GB SSD)"
                                    className="h-9 text-xs"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>
                        </div>

                        {/* Nút xóa dòng thuộc tính */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0 transition-colors"
                          onClick={() => removeSpec(specIdx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex items-center gap-x-2.5">
                          <Controller
                            name={`salesAttributes.${specIdx}.isSKU`}
                            control={form.control}
                            render={({ field }) => (
                              <Switch
                                className="data-[state=checked]:bg-primary scale-90"
                                checked={field.value}
                                id={`sku-${specIdx}`}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />

                          <label
                            htmlFor={`sku-${specIdx}`}
                            className="text-muted-foreground group-hover:text-foreground cursor-pointer font-medium transition-colors select-none"
                          >
                            SKU?
                          </label>
                        </div>
                        <div className="border-muted-foreground/10 bg-background flex items-center gap-x-2 rounded-xl border px-2 py-0.5 shadow-sm">
                          <span className="text-muted-foreground text-[11px] font-medium tracking-wide">
                            Order:
                          </span>

                          <Controller
                            name={`salesAttributes.${specIdx}.order`}
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
                  </div>
                ))}

                {specFields.length === 0 && (
                  <div className="text-muted-foreground border-muted-foreground/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-6 text-center text-xs">
                    <p>No attributes added yet.</p>
                    <p>Click Add Attribute to add technical details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooterAction onClose={onClose} isPending={isPending} isBack />
        </form>
      </DialogContent>
    </Dialog>
  )
}
