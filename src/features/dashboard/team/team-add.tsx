import { Button } from "@/components/ui/button"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useFindAllStaffs } from "@/hooks/use-staff"
import { useCreateTeam } from "@/hooks/use-team"
import { VALUE_COMPANY_ROOT } from "@/shared/constants/team.constant"
import { CreateTeamDto, CreateTeamSchema } from "@/shared/dtos/req/team.dto"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { Plus } from "lucide-react"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

export function TeamAdd({
  open,
  storeId,
  onOpenChange,
  selectedParent,
}: {
  open: boolean
  storeId: string
  onOpenChange: (open: boolean) => void
  selectedParent: Pick<ITeam, "id" | "name"> | null
}) {
  //
  const anchor = useComboboxAnchor()

  //
  const form = useForm<z.infer<typeof CreateTeamSchema>>({
    defaultValues: {
      name: "",
      desc: "",
      members: [],
      isActive: true,
      leader: undefined,
      store: storeId === VALUE_COMPANY_ROOT ? undefined : storeId,
    },
  })

  //
  const createApi = useCreateTeam()
  const { data: staffData } = useFindAllStaffs()
  const staffs = staffData?.metadata?.data || []

  //
  const onSubmit = async (values: CreateTeamDto) => {
    await createApi.mutateAsync({
      ...values,
      store: storeId === VALUE_COMPANY_ROOT ? undefined : storeId,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="text-blue-500" size={20} />
            Thêm nhóm vào [{selectedParent?.name}]
          </DialogTitle>
          <DialogDescription>
            Vui lòng nhập tên cho bộ phận mới của bạn.
          </DialogDescription>
        </DialogHeader>
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

          <FieldGroup>
            <Controller
              name="leader"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-leader">Leader</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        size="sm"
                        id="form-leader"
                      >
                        <SelectValue placeholder="Select a leader" />
                      </SelectTrigger>
                      <SelectContent align="end" className="z-3000">
                        <SelectGroup>
                          {staffs.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.fullName}
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

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createApi.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createApi.isPending ? "Đang lưu..." : "Xác nhận tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
