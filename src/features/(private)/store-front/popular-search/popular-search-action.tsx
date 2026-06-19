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
import {
  CreatePopularSearchSchema,
  UpdatePopularSearchSchema,
} from "@/shared/dtos/req/popular-search.dto"
import { IPopularSearch } from "@/shared/interfaces/models/store-front/popular-search.interface"
import {
  useCreatePopularSearch,
  useUpdatePopularSearch,
} from "@/hooks/apis/store-front/use-popular-search"

const initFormValue: z.infer<typeof CreatePopularSearchSchema> = {
  text: "",
}

//
export function PopularSearchAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IPopularSearch | null
  initialData?: IPopularSearch | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreatePopularSearch()
  const updateApi = useUpdatePopularSearch()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit
    ? UpdatePopularSearchSchema
    : CreatePopularSearchSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        text: dataEdit.text,
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
          ...(data as z.infer<typeof CreatePopularSearchSchema>),
        })
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process popular search:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Popular Search" : "Add New Popular Search"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new popular search.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-6 space-y-6">
            <FieldGroup>
              <Controller
                name="text"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-text">Text</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Text for the popular search"
                      autoComplete="name"
                      id="form-rhf-input-text"
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
