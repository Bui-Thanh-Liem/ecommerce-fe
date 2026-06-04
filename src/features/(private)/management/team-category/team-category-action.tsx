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
import {
  useCreateTeamCategory,
  useUpdateTeamCategory,
} from "@/hooks/apis/use-team-category"
import {
  CreateTeamCategorySchema,
  UpdateTeamCategorySchema,
} from "@/shared/dtos/req/team-category.dto"
import { TeamCategoryCode } from "@/shared/enums/team-category-code.enum"
import { TeamType } from "@/shared/enums/team-type.enum"
import { ITeamCategory } from "@/shared/interfaces/models/team-category.interface"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof CreateTeamCategorySchema> = {
  name: "",
  type: TeamType.HEADQUARTER,
  code: TeamCategoryCode.ADMINISTRATION,
}

export function TeamCategoryAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange,
}: {
  open: boolean
  onClose?: () => void
  dataEdit: ITeamCategory | null
  initialData: ITeamCategory | null
  onOpenChange?: (open: boolean) => void
}) {
  console.log("TeamCategoryAction - dataEdit:", dataEdit)
  console.log("TeamCategoryAction - initialData:", initialData)

  //
  const createApi = useCreateTeamCategory()
  const updateApi = useUpdateTeamCategory()

  //
  const formSchema = !!dataEdit
    ? UpdateTeamCategorySchema
    : CreateTeamCategorySchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name,
        type: dataEdit.type,
        code: dataEdit.code,
      })
    } else {
      form.reset(initFormValue)
    }
  }, [dataEdit])

  //
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
      })
    }
  }, [initialData])

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
          data as z.infer<typeof CreateTeamCategorySchema>
        )
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to create staff:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Team Category" : "Add New Team Category"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new team category.`}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
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
              name="code"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-code">Code</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        id="form-code"
                      >
                        <SelectValue placeholder="Select a code" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectGroup>
                          {Object.values(TeamCategoryCode).map((code) => (
                            <SelectItem key={code} value={code}>
                              {code}
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
              name="type"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-type">Type</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        id="form-type"
                      >
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectGroup>
                          {Object.values(TeamType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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

          <DialogFooterAction
            onClose={onClose}
            isPending={createApi.isPending || updateApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
