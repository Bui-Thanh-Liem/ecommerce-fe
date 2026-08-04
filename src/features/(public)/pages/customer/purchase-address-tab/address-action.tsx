import { Dialog, DialogContent, DialogFooterAction, DialogHeaderAction } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GenerateLocation } from "@/features/(private)/inventory/store/generate-location"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { CreateCustomerAddressSchema, UpdateCustomerAddressSchema } from "@/shared/dtos/req/customer-address.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import { ICustomerAddress } from "@/shared/interfaces/models/customer/customer-address.interface"
import { useCreateCustomerAddress, useUpdateOwnedCustomerAddress } from "@/hooks/apis/customer/user-customer-address"
import { AddressMap } from "./address-map"

const initFormValue: z.infer<typeof UpdateCustomerAddressSchema> = {
  country: "",
  provinceCity: "",
  districtTown: "",
  wardCommune: "",
  address: "",
  lng: 0,
  lat: 0,
  recipientName: "",
  recipientPhone: "",
  isDefault: false,
}

export function AddressAction({
  open,
  onClose,
  dataEdit,
  onOpenChange,
}: {
  open: boolean
  onClose?: () => void
  dataEdit: ICustomerAddress | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateCustomerAddress()
  const updateApi = useUpdateOwnedCustomerAddress()

  //
  const formSchema = !!dataEdit ? UpdateCustomerAddressSchema : CreateCustomerAddressSchema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        provinceCity: dataEdit.provinceCity.id,
        country: dataEdit.country.id,
        districtTown: dataEdit.districtTown.id,
        wardCommune: dataEdit.wardCommune.id,
        address: dataEdit.address,
        recipientName: dataEdit.recipientName,
        recipientPhone: dataEdit.recipientPhone,
        isDefault: dataEdit.isDefault,
      })
    }
  }, [dataEdit, form])

  //
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
    if (!open) {
      onClose?.()
      form.reset(initFormValue)
    }
  }

  //
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // 1. Gọi API tạo mới hoặc cập nhật brand
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
          ...data,
        } as z.infer<typeof CreateCustomerAddressSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      toast.error("Error saving address. Please try again. " + (error instanceof Error ? error.message : ""))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-2000 sm:max-w-7xl">
        <DialogHeaderAction title="Chọn địa chỉ giao hàng" desc="Vui lòng chọn địa chỉ giao hàng." />
        <div className="grid grid-cols-5 gap-x-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-2 space-y-6">
            <div className="flex gap-x-6">
              <FieldGroup>
                <Controller
                  name="recipientName"
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
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="recipientPhone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-phone">Phone</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Phone"
                        autoComplete="phone"
                        id="form-rhf-input-phone"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <GenerateLocation
              form={form as any}
              labelCountry="Quốc gia"
              labelProvinceCity="Tỉnh/Thành phố"
              labelDistrictTown="Quận/Huyện"
              labelWardCommune="Phường/Xã"
              placeholderCountry="Chọn quốc gia"
              placeholderProvinceCity="Chọn tỉnh/thành phố"
              placeholderDistrictTown="Chọn quận/huyện"
              placeholderWardCommune="Chọn phường/xã"
            />

            <FieldGroup>
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-desc">Địa chỉ chi tiết</FieldLabel>
                    <Textarea
                      {...field}
                      rows={2}
                      aria-invalid={fieldState.invalid}
                      placeholder="Nhập địa chỉ chi tiết..."
                      id="form-rhf-textarea-desc"
                      className="resize-none"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="hidden">
              <Controller
                name="lng"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-lng">lng</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="lng"
                      autoComplete="lng"
                      id="form-rhf-input-lng"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="hidden">
              <Controller
                name="lat"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-lat">lat</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="lat"
                      autoComplete="lat"
                      id="form-rhf-input-lat"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooterAction
              onClose={onClose}
              contentCancel="Hủy"
              isPending={createApi.isPending || updateApi.isPending}
              contentOk="Lưu thay đổi"
              contentPending="Đang lưu..."
            />
          </form>
          <div className="col-span-3">
            <AddressMap
              address={dataEdit!}
              cb={(address) => {
                form.setValue("lat", address.lat)
                form.setValue("lng", address.lng)
                form.setValue("address", address.address)
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
