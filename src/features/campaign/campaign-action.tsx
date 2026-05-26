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
import { Textarea } from "@/components/ui/textarea"
import {
  CreateCampaignSchema,
  UpdateCampaignSchema,
} from "@/shared/dtos/req/campaign.dto"
import { ICampaign } from "@/shared/interfaces/models/campaign.interface"
import { useCreateCampaign, useUpdateCampaign } from "@/hooks/apis/use-campaign"

const initFormValue: z.infer<typeof CreateCampaignSchema> = {
  name: "",
  desc: "",
  images: [],
  isActive: false,
  promotions: [],
  startDate: new Date(),
  endDate: new Date(),
  mainImage: undefined,
}

//
export function CampaignAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: ICampaign | null
  initialData?: ICampaign | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateCampaign()
  const updateApi = useUpdateCampaign()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit ? UpdateCampaignSchema : CreateCampaignSchema
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
        images: dataEdit.images,
        isActive: dataEdit.isActive,
        mainImage: dataEdit.mainImage,
        startDate: new Date(dataEdit.startDate),
        endDate: new Date(dataEdit.endDate),
        promotions: dataEdit.promotions.map((promo) => promo.id),
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
        promotions: initialData.promotions.map((promo) => promo.id),
      })
    }

    return () => {
      form.reset(initFormValue)
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
          ...(data as z.infer<typeof CreateCampaignSchema>),
        })
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
          title={!!dataEdit ? "Edit Campaign" : "Add New Campaign"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new campaign.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-2 space-y-6">
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
