"use client"

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
} from "@/hooks/apis/use-product-variant"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateProductVariantSchema,
  UpdateProductVariantSchema,
} from "@/shared/dtos/req/product-variant.dto"
import { ProductVariantCondition } from "@/shared/enums/product-variant-condition.enum"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { IProductVariant } from "@/shared/interfaces/models/product-variant.interface"
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

const initFormValue = {
  price: 0,
  product: "",
  discountPercent: 0,
  conditions: ProductVariantCondition.NEW,
  specifications: [
    {
      title: "Cấu hình chung",
      items: [
        {
          key: "",
          value: "",
          priority: 0,
          isSKU: true,
          order: 0,
        },
      ],
    },
  ],
  productImages: [],
}

interface PreviewImage {
  file?: File
  url: string
}

// 
export function ProductVariantAction({
  open,
  onClose,
  dataEdit,
  productId, // Thường variant sẽ gắn liền hoặc kế thừa từ 1 product id cha nào đó
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IProductVariant | null
  productId?: string
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateProductVariant()
  const updateApi = useUpdateProductVariant()
  const uploadApi = useUploadCloudinary()

  const [previews, setPreviews] = useState<PreviewImage[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit
    ? UpdateProductVariantSchema
    : CreateProductVariantSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...initFormValue, product: productId || "" },
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

  useEffect(() => {
    if (dataEdit) {
      form.reset({
        price: dataEdit.price,
        product: dataEdit.product?.id || dataEdit.product,
        discountPercent: dataEdit.discountPercent,
        conditions: dataEdit.conditions,
        specifications: dataEdit.specifications,
        productImages:
          dataEdit.productImages?.map((img) => ({ image: img.image })) || [],
      })

      if (dataEdit.productImages) {
        setPreviews(
          dataEdit.productImages.map((img) => ({ url: img.image.url }))
        )
      }
    } else {
      form.reset({ ...initFormValue, product: productId || "" })
      setPreviews([])
      setSelectedFiles(null)
    }
  }, [dataEdit, form, productId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files)
      setSelectedFiles((prev) =>
        prev ? [...prev, ...newFilesArray] : newFilesArray
      )

      const newPreviews = newFilesArray.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      setPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const itemToRemove = previews[indexToRemove]
    if (itemToRemove.file) {
      URL.revokeObjectURL(itemToRemove.url)
    }

    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove))
    setSelectedFiles((prev) => {
      if (!prev) return null
      const filtered = prev.filter((_, idx) => {
        const previewItem = previews[idx]
        return previewItem.file !== itemToRemove.file
      })
      return filtered.length > 0 ? filtered : null
    })

    const currentImages = form.getValues("productImages") || []
    form.setValue(
      "productImages",
      currentImages.filter((_, idx) => idx !== indexToRemove),
      { shouldValidate: true }
    )
  }

  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.()
      setPreviews([])
      setSelectedFiles(null)
      form.reset(initFormValue)
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsPending(true)
    try {
      let images: IImage[] =
        dataEdit?.productImages?.map((img) => img.image) || []

      // Xử lý upload ảnh mới nếu có thêm file local blob
      if (selectedFiles && selectedFiles.length > 0) {
        const uploadedImages = await Promise.all(
          selectedFiles.map((file) =>
            uploadApi.mutateAsync({
              file: file,
              payload: { folder: "products" },
            })
          )
        )

        const newImages: IImage[] = uploadedImages
          .filter((res) => res?.url)
          .map((res) => ({
            url: res.url,
            key: res.public_id,
            provider: Provider.CLOUDINARY,
          }))

        images = [...images, ...newImages]
      }

      if (images.length === 0) {
        toast.error("At least one product image is required.")
        return
      }

      const payload = {
        ...data,
        productImages: images.map((img) => ({ image: img })),
      }

      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({ id: dataEdit.id, payload })
      } else {
        res = await createApi.mutateAsync(payload)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        toast.success(
          dataEdit
            ? "Variant updated successfully!"
            : "Variant created successfully!"
        )
        handleOpenChange(false)
      }
    } catch (error) {
      toast.error("Failed to save product variant.")
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Variant" : "Add Product Variant"}
          desc="Manage pricing, images, and custom specifications for this product variant."
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-240px)] space-y-6 overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Cột trái: Thông tin cơ bản & Hình ảnh */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Price</FieldLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                          <InputGroupAddon align="inline-end">
                            USD
                          </InputGroupAddon>
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
                    name="discountPercent"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Discount Percent</FieldLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                          <InputGroupAddon align="inline-end">
                            %
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <Controller
                  name="conditions"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Condition</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select variant condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(ProductVariantCondition).map(
                              (cond) => (
                                <SelectItem key={cond} value={cond}>
                                  {cond}
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
                  )}
                />
              </FieldGroup>

              {/* Upload Multi-Images */}
              <FieldGroup>
                <FieldLabel>Variant Images</FieldLabel>
                <div className="flex flex-col gap-4 rounded-lg border-2 border-dashed p-4">
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {previews.map((item, index) => (
                        <div
                          key={index}
                          className="relative h-24 w-full overflow-hidden rounded-md border"
                        >
                          <Image
                            fill
                            alt="Preview"
                            src={item.url}
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 rounded-full"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex w-full flex-col items-center py-2 text-center">
                    <ImageIcon className="text-muted-foreground/50 h-8 w-8" />
                    <p className="text-muted-foreground mt-1 text-xs">
                      Click to upload variant gallery images
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </FieldGroup>
            </div>

            {/* Cột phải: Khối Dynamic Specifications (Nested Field Array) */}
            <div className="bg-muted/20 space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-sm font-semibold">
                  Specifications
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendSpec({
                      title: "",
                      items: [
                        {
                          key: "",
                          value: "",
                          priority: 0,
                          isSKU: true,
                          order: 0,
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
                    className="bg-background relative space-y-3 rounded-md border p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-x-2">
                      <Controller
                        name={`specifications.${specIdx}.title`}
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Group Title (e.g., Screen, Memory)"
                            className="font-medium"
                          />
                        )}
                      />
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
                    <SpecificationItems form={form} specIdx={specIdx} />
                  </div>
                ))}
              </div>
            </div>
          </div>

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
  form: UseFormReturn<any>
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
    <div className="border-muted space-y-2 border-l-2 pl-4">
      {itemFields.map((item, itemIdx) => (
        <div
          key={item.id}
          className="bg-muted/10 space-y-2 rounded border p-2 text-xs"
        >
          <div className="flex items-center gap-2">
            <Controller
              name={`specifications.${specIdx}.items.${itemIdx}.key`}
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Key (e.g. RAM)"
                  className="h-8"
                />
              )}
            />
            <Controller
              name={`specifications.${specIdx}.items.${itemIdx}.value`}
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Value (e.g. 16GB)"
                  className="h-8"
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive h-8 w-8 shrink-0"
              onClick={() => removeItem(itemIdx)}
              disabled={itemFields.length === 1}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-x-4 px-1">
            <div className="flex items-center gap-x-2">
              <Controller
                name={`specifications.${specIdx}.items.${itemIdx}.isSKU`}
                control={form.control}
                render={({ field }) => (
                  <Switch
                    id={`sku-${specIdx}-${itemIdx}`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="scale-75"
                  />
                )}
              />
              <label
                htmlFor={`sku-${specIdx}-${itemIdx}`}
                className="text-muted-foreground select-none"
              >
                Is SKU attribute
              </label>
            </div>

            <div className="flex w-24 items-center gap-x-1">
              <span className="text-muted-foreground shrink-0">Priority:</span>
              <Controller
                name={`specifications.${specIdx}.items.${itemIdx}.priority`}
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    className="h-7 px-1 text-center"
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

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-primary hover:text-primary/80 h-7 text-xs"
        onClick={() =>
          appendItem({ key: "", value: "", priority: 0, isSKU: true, order: 0 })
        }
      >
        <Plus className="mr-1 h-3.5 w-3.5" /> Add Detail Row
      </Button>
    </div>
  )
}
