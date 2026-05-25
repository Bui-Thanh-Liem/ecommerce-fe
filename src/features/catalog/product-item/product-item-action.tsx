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
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { useFindAllProductVariants } from "@/hooks/apis/use-product-variant"
import {
  CreateProductItemSchema,
  UpdateProductItemSchema,
} from "@/shared/dtos/req/product-item.dto"
import { ProductItemStatus } from "@/shared/enums/product-item-status.enum"
import {
  useCreateProductItem,
  useUpdateProductItem,
} from "@/hooks/apis/use-product-item"
import { IProductItem } from "@/shared/interfaces/models/product-item.interface"
import { useFindAllInventories } from "@/hooks/apis/use-inventory"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"

const initFormValue: z.infer<typeof CreateProductItemSchema> = {
  inventory: "",
  purchasePrice: 0,
  serialNumber: "",
  productVariant: "",
  locationInWarehouse: "",
  status: ProductItemStatus.NEW,
}

//
export function ProductItemAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IProductItem | null
  initialData?: IProductItem | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateProductItem()
  const updateApi = useUpdateProductItem()

  const { data: productVariantsData } = useFindAllProductVariants()
  const productVariants = productVariantsData?.metadata?.data || []
  const { data: inventoryData } = useFindAllInventories()
  const inventories = inventoryData?.metadata?.data || []

  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit
    ? UpdateProductItemSchema
    : CreateProductItemSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        inventory: dataEdit.inventory.id,
        purchasePrice: dataEdit.purchasePrice,
        serialNumber: dataEdit.serialNumber,
        productVariant: dataEdit.productVariant.id,
        locationInWarehouse: dataEdit.locationInWarehouse,
        status: dataEdit.status,
      })
    } else {
      form.reset(initFormValue)
    }

    return () => {
      form.reset(initFormValue)
    }
  }, [dataEdit, form])

  // Theo dõi initialData
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
      })
    }

    return () => {
      form.reset(initFormValue)
    }
  }, [form, initialData])

  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)

    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      form.reset(initFormValue)
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsPending(true)

    try {
      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: {
            ...data,
          },
        })
      } else {
        res = await createApi.mutateAsync({
          ...data,
        } as z.infer<typeof CreateProductItemSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
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
          title={!!dataEdit ? "Edit Product Item" : "Add New Product Item"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new product item.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] space-y-6 overflow-x-hidden overflow-y-auto px-1"
        >
          <FieldGroup>
            <Controller
              name="inventory"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-inventory">Inventory</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        id="form-inventory"
                      >
                        <SelectValue placeholder="Select an inventory" />
                      </SelectTrigger>

                      <SelectContent align="end">
                        <SelectGroup>
                          {inventories.map((variant) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.store.name}
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
              name="productVariant"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-productVariant">
                      Product Variant
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        id="form-productVariant"
                      >
                        <SelectValue placeholder="Select a product variant" />
                      </SelectTrigger>

                      <SelectContent align="end">
                        <SelectGroup>
                          {productVariants.map((variant) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.product.name} - {variant.sku}
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

          <div className="grid grid-cols-3 gap-x-4">
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
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent align="end">
                          <SelectGroup>
                            {Object.values(ProductItemStatus).map((status) => (
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
                name="serialNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-serial-number">
                      Serial Number
                    </FieldLabel>

                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Serial Number"
                      autoComplete="name"
                      id="form-rhf-input-serial-number"
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
                name="purchasePrice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-purchase-price">
                      Purchase Price
                    </FieldLabel>

                    <InputGroup>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        placeholder="Purchase Price"
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
                        id="form-rhf-input-purchase-price"
                      />

                      <InputGroupAddon align="inline-end">USD</InputGroupAddon>
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
              name="locationInWarehouse"
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
                    placeholder="Enter location in warehouse here..."
                    id="form-rhf-textarea-location-in-warehouse"
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
