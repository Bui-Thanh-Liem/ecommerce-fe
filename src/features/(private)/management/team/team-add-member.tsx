import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
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
import { useFindAllStaffs } from "@/hooks/apis/use-staff"
import { useFindAllStores } from "@/hooks/apis/use-store"
import { useCreateTeam, useUpdateTeam } from "@/hooks/apis/use-team"
import { useFindAllTeamCategories } from "@/hooks/apis/use-team-category"
import { UpdateTeamSchema } from "@/shared/dtos/req/team.dto"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof UpdateTeamSchema> = {
  members: [],
}

export function TeamAddMember({
  open,
  onClose,
  dataEdit,
  onOpenChange,
}: {
  open: boolean
  onClose?: () => void
  dataEdit: ITeam | null
  onOpenChange?: (open: boolean) => void
}) {
  //
  const anchor = useComboboxAnchor()
  const createApi = useCreateTeam()
  const updateApi = useUpdateTeam()

  //
  const { data: staffData } = useFindAllStaffs()
  const staffs = staffData?.metadata?.data || []

  //
  const form = useForm<z.infer<typeof UpdateTeamSchema>>({
    resolver: zodResolver(UpdateTeamSchema),
    defaultValues: initFormValue,
  })

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        members: dataEdit.members?.map((m) => m.id) || [],
      })
    } else {
      form.reset(initFormValue)
    }
  }, [dataEdit, form])

  //
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
    }
  }

  //
  const onSubmit = async (data: z.infer<typeof UpdateTeamSchema>) => {
    try {
      if (dataEdit) {
        const res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: data,
        })
        if (res && [200, 201].includes(res?.statusCode)) {
          form.reset()
          onClose?.()
        }
      }
    } catch (error) {
      console.error("Failed to update team:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeaderAction title="" desc="" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldGroup>
            <Controller
              name="members" // Tên field trong Zod schema (nên là z.array(z.string()))
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Members</FieldLabel>

                    <Combobox
                      multiple
                      autoHighlight
                      // Chuyển danh sách staff từ API thành mảng string hoặc object tùy component yêu cầu
                      items={staffs.map((s) => s.id)}
                      value={field.value} // Gán giá trị từ RHF
                      onValueChange={field.onChange} // Cập nhật lại RHF khi chọn
                    >
                      <ComboboxChips ref={anchor} className="w-full">
                        <ComboboxValue>
                          {(values: string[]) => (
                            <React.Fragment>
                              {values.map((value) => {
                                const staffName = staffs.find(
                                  (s) => s.id === value
                                )?.fullName
                                return (
                                  <ComboboxChip key={value}>
                                    {staffName || value}
                                  </ComboboxChip>
                                )
                              })}
                              <ComboboxChipsInput placeholder="Select staff..." />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent
                        anchor={anchor}
                        className="pointer-events-auto"
                      >
                        <ComboboxEmpty>No staff found.</ComboboxEmpty>
                        <ComboboxList>
                          {(id: string) => {
                            const staffName = staffs.find(
                              (s) => s.id === id
                            )?.fullName
                            return (
                              <ComboboxItem key={id} value={id}>
                                {staffName}
                              </ComboboxItem>
                            )
                          }}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

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
            isPending={createApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
