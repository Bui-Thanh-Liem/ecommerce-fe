import { CategorySelectInForm } from "@/components/select-in-form/category"
import { PromotionSelectInForm } from "@/components/select-in-form/promotion"
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
  useCreateCategoryPromotion,
  useUpdateCategoryPromotion,
} from "@/hooks/apis/mkt-program/use-category-promotion"
import {
  CreateCategoryPromotionSchema,
  UpdateCategoryPromotionSchema,
} from "@/shared/dtos/req/category-promotion.dto"
import { ICategoryPromotion } from "@/shared/interfaces/models/mkt-program/category-promotion.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowBigUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof CreateCategoryPromotionSchema> = {
  promotion: "",
  category: "",
  customDiscount: 0,
  priority: 0,
  limitQuantity: 0,
}

export function CategoryPromotionAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: ICategoryPromotion | null
  initialData?: ICategoryPromotion | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateCategoryPromotion()
  const updateApi = useUpdateCategoryPromotion()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit
    ? UpdateCategoryPromotionSchema
    : CreateCategoryPromotionSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        priority: dataEdit.priority,
        category: dataEdit.category.id,
        promotion: dataEdit.promotion.id,
        customDiscount: dataEdit.customDiscount,
        limitQuantity: dataEdit.limitQuantity,
      })
    }
  }, [dataEdit, form])

  // Theo dõi initialData
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
        promotion: initialData.promotion.id,
      })
    }
  }, [form, initialData])

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      form.reset(initFormValue)
    }
  }

  //
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
        } as z.infer<typeof CreateCategoryPromotionSchema>)
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeaderAction
          title={
            !!dataEdit
              ? "Edit Category Promotion"
              : "Add New Category Promotion"
          }
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new category promotion.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-2 space-y-6">
            <PromotionSelectInForm
              form={form}
              name="promotion"
              label="Promotion"
            />
            <CategorySelectInForm
              form={form}
              name="category"
              label="Category"
            />

            <div className="grid grid-cols-3 gap-x-4">
              <FieldGroup>
                <Controller
                  name="customDiscount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-customDiscount">
                        Custom Discount
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Custom Discount"
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
                          id="form-rhf-input-customDiscount"
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

              <FieldGroup>
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-priority">
                        Priority
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Priority"
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
                          id="form-rhf-input-priority"
                        />

                        <InputGroupAddon align="inline-end">
                          <ArrowBigUp />
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
                  name="limitQuantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-limitQuantity">
                        Limit Quantity
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Limit Quantity"
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
                          id="form-rhf-input-limitQuantity"
                        />

                        <InputGroupAddon align="inline-end">
                          <ArrowBigUp />
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
