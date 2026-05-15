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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFindAllPermissions } from "@/hooks/apis/use-permission"
import { useCreateRole } from "@/hooks/apis/use-role"
import { useFindAllStores } from "@/hooks/apis/use-store"
import { cn } from "@/lib/utils"
import { CreateRoleSchema } from "@/shared/dtos/req/role.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { groupByKeyGroup } from "../permission/permission-page"

export function RoleAdd({
  open,
  onClose,
  onOpenChange,
}: {
  open: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
}) {
  const anchor = useComboboxAnchor()

  //
  const { data } = useFindAllPermissions()
  const permissions = data?.metadata || []
  const groupedPermissions = groupByKeyGroup(permissions)

  //
  const { data: rolesData } = useFindAllStores()
  const stores = rolesData?.metadata?.data || []

  //
  const createApi = useCreateRole()

  //
  const form = useForm<z.infer<typeof CreateRoleSchema>>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: "",
      desc: "",
      stores: [],
      permissions: [],
      isActive: true,
    },
  })
  const permissionErrors = form.formState.errors.permissions

  //
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
    }
  }

  //
  async function onSubmit(data: z.infer<typeof CreateRoleSchema>) {
    try {
      const res = await createApi.mutateAsync(data)
      if (res?.statusCode === 201) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to create role:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeaderAction
          title="Add Role"
          desc="Fill in the details to create a new role."
        />
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            {/*  */}
            <div className="space-y-4">
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
                  name="stores" // Tên field trong Zod schema (nên là z.array(z.string()))
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Stores</FieldLabel>

                        <Combobox
                          multiple
                          autoHighlight
                          // Chuyển danh sách store từ API thành mảng string hoặc object tùy component yêu cầu
                          items={stores.map((s) => s.id)}
                          value={field.value} // Gán giá trị từ RHF
                          onValueChange={field.onChange} // Cập nhật lại RHF khi chọn
                        >
                          <ComboboxChips ref={anchor} className="w-full">
                            <ComboboxValue>
                              {(values: string[]) => (
                                <React.Fragment>
                                  {values.map((value) => {
                                    const storeName = stores.find(
                                      (s) => s.id === value
                                    )?.name
                                    return (
                                      <ComboboxChip key={value}>
                                        {storeName || value}
                                      </ComboboxChip>
                                    )
                                  })}
                                  <ComboboxChipsInput placeholder="Select stores..." />
                                </React.Fragment>
                              )}
                            </ComboboxValue>
                          </ComboboxChips>

                          <ComboboxContent
                            anchor={anchor}
                            className="pointer-events-auto"
                          >
                            <ComboboxEmpty>No stores found.</ComboboxEmpty>
                            <ComboboxList>
                              {(id: string) => {
                                const storeName = stores.find(
                                  (s) => s.id === id
                                )?.name
                                return (
                                  <ComboboxItem key={id} value={id}>
                                    {storeName}
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

              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-name">
                        Name
                      </FieldLabel>
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
            </div>

            {/* Permissions */}
            <div>
              <FieldLabel
                className={cn("mb-2", permissionErrors && "text-destructive")}
              >
                Permissions
              </FieldLabel>
              <div className="max-h-[calc(100vh-300px)] space-y-4 overflow-y-auto">
                {Object.entries(groupedPermissions).map(([keyGroup, perms]) => (
                  <div key={keyGroup} className="border-b p-2 last:border-0">
                    <p className="bg-muted mb-2 rounded-sm px-2 py-1 text-sm font-medium">
                      {keyGroup}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map((perm) => (
                        <div
                          key={perm.id}
                          className="flex items-center space-x-2"
                        >
                          <Controller
                            name="permissions"
                            control={form.control}
                            render={({ field }) => {
                              const isChecked = field.value.includes(perm.id)

                              return (
                                <Switch
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, perm.id])
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (id) => id !== perm.id
                                        )
                                      )
                                    }
                                  }}
                                />
                              )
                            }}
                          />
                          <span className="text-sm">
                            {perm.code} - {perm.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {permissionErrors && (
                <p className="text-destructive mt-2 text-sm font-medium">
                  {permissionErrors.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooterAction
            onClose={onClose}
            isPending={createApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
