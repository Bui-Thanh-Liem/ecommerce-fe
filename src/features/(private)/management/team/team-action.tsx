import { StaffSelectInForm } from "@/components/select-in-form/staff"
import { StoreSelectInForm } from "@/components/select-in-form/store"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTeam, useUpdateTeam } from "@/hooks/apis/use-team"
import { useFindAllTeamCategories } from "@/hooks/apis/use-team-category"
import { VALUE_HEADQUARTER } from "@/shared/constants/team.constant"
import { CreateTeamSchema, UpdateTeamSchema } from "@/shared/dtos/req/team.dto"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof CreateTeamSchema> = {
  name: "",
  desc: "",
  leader: "",
  category: "",
  members: [],
  isActive: true,
  store: undefined,
}

export function TeamAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange,
  selectedParent,
}: {
  open: boolean
  onClose?: () => void
  dataEdit: ITeam | null
  initialData: ITeam | null
  onOpenChange?: (open: boolean) => void
  selectedParent: Pick<ITeam, "id" | "name"> | null
}) {
  //
  const createApi = useCreateTeam()
  const updateApi = useUpdateTeam()

  //
  const { data: teamCategoriesData } = useFindAllTeamCategories()
  const teamCategories = teamCategoriesData?.metadata?.data || []

  //
  const formSchema = !!dataEdit ? UpdateTeamSchema : CreateTeamSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name || "",
        desc: dataEdit.desc || "",
        store: dataEdit.store?.id || undefined,
        leader: dataEdit.leader?.id || undefined,
        category: dataEdit.category?.id || undefined,
        isActive: dataEdit.isActive ?? true,
        members: dataEdit.members?.map((m) => m.id) || [],
      })
    } else {
      form.reset(initFormValue)
    }
  }, [dataEdit, form])

  //
  useEffect(() => {
    if (initialData) {
      const storeId = initialData.store?.id || VALUE_HEADQUARTER

      form.reset({
        ...initFormValue,
        store: storeId === VALUE_HEADQUARTER ? undefined : storeId,
      })
    }
  }, [form, initialData])

  //
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
    }
  }

  //
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: data,
        })
      } else {
        res = await createApi.mutateAsync(
          data as z.infer<typeof CreateTeamSchema>
        )
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to create team:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeaderAction
          title={
            !!dataEdit
              ? "Edit Team"
              : "Add New Team" +
                (selectedParent ? ` in [${selectedParent.name}]` : "")
          }
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new team.`}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
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
                    placeholder="name"
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

          <StoreSelectInForm
            form={form}
            name="store"
            label="Store"
            multiple={false}
          />

          <FieldGroup>
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-category">Category</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        size="sm"
                        id="form-category"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent align="end" className="z-3000">
                        <SelectGroup>
                          {teamCategories.map((category) => (
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

          <StaffSelectInForm
            form={form}
            name="leader"
            label="Leader"
            multiple={false}
          />

          <StaffSelectInForm
            form={form}
            name="members"
            label="Members"
            multiple={true}
          />

          <DialogFooterAction
            onClose={onClose}
            isPending={createApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
