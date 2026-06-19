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
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { CreateMenuSchema, UpdateMenuSchema } from "@/shared/dtos/req/menu.dto"
import { useCreateMenu, useUpdateMenu } from "@/hooks/apis/store-front/use-menu"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"

const initFormValue: z.infer<typeof CreateMenuSchema> = {
  name: "",
  desc: "",
  link: "",
  isActive: true,
}

//
export function MenuAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IMenu | null
  initialData?: IMenu | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateMenu()
  const updateApi = useUpdateMenu()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit ? UpdateMenuSchema : CreateMenuSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name,
        link: dataEdit.link,
        isActive: dataEdit.isActive,
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
          ...(data as z.infer<typeof CreateMenuSchema>),
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
          title={!!dataEdit ? "Edit Product Navbar" : "Add New Product Navbar"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new product navbar.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-6 space-y-6">
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
                name="link"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-link">Link</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Link"
                      autoComplete="link"
                      id="form-rhf-input-link"
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
