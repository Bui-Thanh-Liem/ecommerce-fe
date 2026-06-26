import { AvatarUpload } from "@/components/avatar-upload"
import { RoleSelectInForm } from "@/components/select-in-form/role"
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
import {
  useCreateStaff,
  useUpdateStaff,
} from "@/hooks/apis/management/use-staff"
import {
  CreateStaffSchema,
  UpdateStaffSchema,
} from "@/shared/dtos/req/staff.dto"
import { StaffWorkLocationID } from "@/shared/enums/staff-work-location-id.enum"
import { IStaff } from "@/shared/interfaces/models/management/staff.interface"
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
  avatar: undefined,
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
  const createApi = useCreateStaff()
  const updateApi = useUpdateStaff()

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
        store: dataEdit.store?.id || undefined,
        fullName: dataEdit.fullName || "",
        isActive: dataEdit.isActive ?? true,
        isSubAdmin: dataEdit.isSubAdmin ?? false,
        avatar: dataEdit.avatar || undefined,
        roles: dataEdit.roles.map((r) => r.id) || [],
        workLocationID: dataEdit.workLocationID || "",
        directManager: dataEdit.directManager?.id || undefined,
      })
    } else {
      form.reset(initFormValue)
    }
  }, [dataEdit, form])

  //
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
        directManager: initialData.directManager?.id || undefined,
      })
    }
  }, [form, initialData])

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
            <AvatarUpload form={form} name="avatar" />
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
            <StoreSelectInForm
              form={form}
              name="store"
              label="Store"
              multiple={false}
            />

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
            <StaffSelectInForm
              form={form}
              name="directManager"
              label="Direct Manager"
            />

            <RoleSelectInForm
              form={form}
              multiple={true}
              name="roles"
              label="Roles"
            />
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
