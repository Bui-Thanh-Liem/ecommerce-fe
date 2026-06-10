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
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import {
  CreateInventorySchema,
  UpdateInventorySchema,
} from "@/shared/dtos/req/inventory.dto"
import { InventoryStockType } from "@/shared/enums/inventory-stock-type.enum"
import {
  useCreateInventory,
  useUpdateInventory,
} from "@/hooks/apis/use-inventory"
import { IInventory } from "@/shared/interfaces/models/inventory.interface"
import { StoreSelectInForm } from "@/components/select-in-form/store"
import { ProductVariantSelectInForm } from "@/components/select-in-form/product-SKU"

const initFormValue: z.infer<typeof CreateInventorySchema> = {
  store: "",
  quantity: 0,
  minStockLevel: 0,
  productVariant: "",
  stockType: InventoryStockType.AVAILABLE,
}

//
export function InventoryAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IInventory | null
  initialData?: IInventory | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateInventory()
  const updateApi = useUpdateInventory()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit ? UpdateInventorySchema : CreateInventorySchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        store: dataEdit.store.id,
        quantity: dataEdit.quantity,
        minStockLevel: dataEdit.minStockLevel,
        productVariant: dataEdit.productVariant.id,
        stockType: dataEdit.stockType,
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
        productVariant: initialData.productVariant.id,
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
          ...(data as z.infer<typeof CreateInventorySchema>),
        })
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Inventory" : "Add New Inventory"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new inventory.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-2 space-y-6">
            {/* */}
            <StoreSelectInForm
              form={form}
              name="store"
              label="Store"
              multiple={false}
            />

            {/*  */}
            <ProductVariantSelectInForm
              form={form}
              name="productVariant"
              label="Product variant"
              multiple={false}
            />

            {/*  */}
            <FieldGroup>
              <Controller
                name="stockType"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-stockType">
                        Stock Type
                      </FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-stockType"
                        >
                          <SelectValue placeholder="Select stock type" />
                        </SelectTrigger>

                        <SelectContent align="end">
                          <SelectGroup>
                            {Object.values(InventoryStockType).map((status) => (
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

            <div className="grid grid-cols-2 gap-x-4">
              {/*  */}
              <FieldGroup>
                <Controller
                  name="quantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-quantity">
                        Quantity
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Quantity"
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
                          id="form-rhf-input-quantity"
                        />

                        <InputGroupAddon align="inline-end">
                          item
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
                  name="minStockLevel"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-minStockLevel">
                        Minimum Stock Level
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Minimum Stock Level"
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
                          id="form-rhf-input-minStockLevel"
                        />

                        <InputGroupAddon align="inline-end">
                          item
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
          </div>

          <DialogFooterAction onClose={onClose} isPending={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
