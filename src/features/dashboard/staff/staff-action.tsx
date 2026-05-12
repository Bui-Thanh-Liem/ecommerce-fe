import { AvatarUpload } from "@/components/avatar-upload"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemStaff,
  SelectTrigger,
  SelectTriggerStaff,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useFindAllRoles } from "@/hooks/use-role"
import {
  useCreateStaff,
  useFindAllStaffs,
  useUpdateStaff,
} from "@/hooks/use-staff"
import { useFindAllStores } from "@/hooks/use-store"
import { MAX_ROLES_IN_STAFF } from "@/shared/constants/staff.constant"
import {
  CreateStaffSchema,
  UpdateStaffSchema,
} from "@/shared/dtos/req/staff.dto"
import { StaffWorkLocationID } from "@/shared/enums/staff-work-location-id.enum"
import { IStaff } from "@/shared/interfaces/models/staff.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof CreateStaffSchema> = {
  roles: [],
  email: "",
  phone: "",
  fullName: "",
  password: "",
  isActive: true,
  isSubAdmin: false,
  store: undefined,
  workLocationID: "",
  confirmPassword: "",
  directManager: "",
  avatarUrl: "",
}

export function StaffAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IStaff | null
  initialData?: IStaff | null
  onOpenChange?: (open: boolean) => void
}) {
  const anchor = useComboboxAnchor()
  const createApi = useCreateStaff()
  const updateApi = useUpdateStaff()

  const { data: storesData } = useFindAllStores()
  const stores = storesData?.metadata?.data || []
  const { data: rolesData } = useFindAllRoles()
  const roles = rolesData?.metadata || []
  const { data: directManagersData } = useFindAllStaffs()
  const directManagers = directManagersData?.metadata?.data || []

  //
  const formSchema = !!dataEdit ? UpdateStaffSchema : CreateStaffSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        password: "",
        confirmPassword: "",
        email: dataEdit.email || "",
        phone: dataEdit.phone || "",
        store: dataEdit.store?.id || "",
        fullName: dataEdit.fullName || "",
        isActive: dataEdit.isActive ?? true,
        isSubAdmin: dataEdit.isSubAdmin ?? false,
        avatarUrl: dataEdit.avatarUrl || "",
        roles: dataEdit.roles.map((r) => r.id) || [],
        workLocationID: dataEdit.workLocationID || "",
        directManager: dataEdit.directManager?.id || "",
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
        directManager: initialData.directManager?.id || "",
      })
    }
  }, [initialData])

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
    }
  }

  //
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // API không cần confirmPassword nên xóa trước khi gửi
      delete data.confirmPassword

      let res = null
      if (dataEdit) {
        delete data.password
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: data,
        })
      } else {
        res = await createApi.mutateAsync(
          data as z.infer<typeof CreateStaffSchema>
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Staff" : "Add New Staff"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new staff member.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] space-y-6 overflow-x-hidden overflow-y-auto px-1"
        >
          <FieldGroup className="mb-12 flex items-center justify-center">
            <AvatarUpload form={form} name="avatarUrl" />
          </FieldGroup>

          <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
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
                name="isSubAdmin"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="form-isSubAdmin">
                        Sub Admin
                      </FieldLabel>
                      <Switch
                        id="form-isSubAdmin"
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
          </div>

          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-fullName">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Full Name"
                    autoComplete="name"
                    id="form-rhf-input-fullName"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
            <FieldGroup>
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-phone">
                      Phone
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Phone"
                      autoComplete="phone"
                      id="form-rhf-input-phone"
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
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Email"
                      autoComplete="email"
                      id="form-rhf-input-email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
            <FieldGroup>
              <Controller
                name="store"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-store">Stores</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-store"
                        >
                          <SelectValue placeholder="Select a store" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectGroup>
                            {stores.map((store) => (
                              <SelectItem key={store.id} value={store.id}>
                                {store.name}
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
                name="workLocationID"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-workLocationID">
                        Work Location
                      </FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-workLocationID"
                        >
                          <SelectValue placeholder="Select a work location" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectGroup>
                            {Object.values(StaffWorkLocationID).map(
                              (workLocation) => (
                                <SelectItem
                                  key={workLocation}
                                  value={workLocation}
                                >
                                  {workLocation}
                                </SelectItem>
                              )
                            )}
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
          </div>

          <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
            <FieldGroup>
              <Controller
                name="directManager"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-directManager">
                        Direct Manager
                      </FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTriggerStaff
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-directManager"
                        >
                          <SelectValue placeholder="Select a direct manager" />
                        </SelectTriggerStaff>
                        <SelectContent align="end">
                          <SelectGroup>
                            {directManagers.map((manager) => (
                              <SelectItemStaff
                                key={manager.id}
                                value={manager.id}
                                avatarUrl={manager.avatarUrl}
                                fullName={manager.fullName}
                              />
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
                name="roles"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-roles">Roles</FieldLabel>

                    <Combobox
                      multiple
                      autoHighlight
                      items={roles}
                      id="form-roles"
                      value={field.value || []}
                      onValueChange={(values) => {
                        if (values.length <= MAX_ROLES_IN_STAFF) {
                          field.onChange(values)
                        }
                      }}
                    >
                      <ComboboxChips ref={anchor} className="w-full">
                        <ComboboxValue>
                          {(values: string[]) => (
                            <>
                              {values.map((value) => {
                                const roleName = roles.find(
                                  (r) => r.id === value
                                )?.name
                                return (
                                  <ComboboxChip key={value}>
                                    {roleName || value}
                                  </ComboboxChip>
                                )
                              })}
                              <ComboboxChipsInput placeholder="Select roles..." />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent
                        anchor={anchor}
                        className="pointer-events-auto"
                      >
                        <ComboboxEmpty>No roles found.</ComboboxEmpty>
                        <ComboboxList>
                          {(
                            role // ← dùng render prop
                          ) => (
                            <ComboboxItem key={role.id} value={role.id}>
                              {role.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {!Boolean(dataEdit) && (
            <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-password">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Password"
                        autoComplete="current-password"
                        id="form-rhf-input-password"
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
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm Password"
                        autoComplete="current-password"
                        id="form-rhf-input-confirm-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          )}

          <DialogFooterAction
            onClose={onClose}
            isPending={createApi.isPending || updateApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
