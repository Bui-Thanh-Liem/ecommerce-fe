"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { GenerateLocation } from "@/features/(private)/inventory/store/generate-location"
import {
  useCreateCustomerAddress,
  useFindAllOwnedCustomerAddresses,
  useUpdateCustomerAddress,
} from "@/hooks/apis/customer/customer-address"
import {
  CreateCustomerAddressSchema,
  UpdateCustomerAddressSchema,
} from "@/shared/dtos/req/customer-address.dto"
import { ICustomerAddress } from "@/shared/interfaces/models/customer/customer-address.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { Home, MapPin, Pencil, Phone, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export function PurchaseAddressTab() {
  const { data } = useFindAllOwnedCustomerAddresses()
  const addresses = data?.metadata?.data || []

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<ICustomerAddress | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Địa chỉ nhận hàng</h2>

          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ
          </Button>
        </div>

        {addresses.length === 0 ? (
          <EmptyAddress />
        ) : (
          <div className="space-y-5">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        )}
      </div>
      <AddressAction open={open} dataEdit={dataEdit} onClose={handleClose} />
    </>
  )
}

const initFormValue: z.infer<typeof UpdateCustomerAddressSchema> = {
  country: "",
  city: "",
  district: "",
  ward: "",
  address: "",
  recipientName: "",
  recipientPhone: "",
  isDefault: false,
}

function AddressAction({
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
  const updateApi = useUpdateCustomerAddress()

  //
  const formSchema = !!dataEdit
    ? UpdateCustomerAddressSchema
    : CreateCustomerAddressSchema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        city: dataEdit.city.id,
        country: dataEdit.country.id,
        district: dataEdit.district.id,
        ward: dataEdit.ward.id,
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
      toast.error(
        "Error saving address. Please try again. " +
          (error instanceof Error ? error.message : "")
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeaderAction
          title="Chọn địa chỉ giao hàng"
          desc="Vui lòng chọn địa chỉ giao hàng."
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="col-span-3">
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="col-span-3">
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

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
                  <FieldLabel htmlFor="form-rhf-input-desc">
                    Địa chỉ chi tiết
                  </FieldLabel>
                  <Textarea
                    {...field}
                    rows={2}
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập địa chỉ chi tiết..."
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

          <DialogFooterAction
            onClose={onClose}
            contentCancel="Hủy"
            isPending={createApi.isPending || updateApi.isPending}
            contentOk="Lưu thay đổi"
            contentPending="Đang lưu..."
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddressCard({ address }: { address: ICustomerAddress }) {
  return (
    <div className="bg-background rounded-xl border">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <Home className="text-primary h-5 w-5" />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{address.recipientName}</h3>

              <Badge variant="secondary">{address.recipientPhone}</Badge>

              {address.isDefault && <Badge>Mặc định</Badge>}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>

          {!address.isDefault && (
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="text-muted-foreground mt-1 h-5 w-5" />

          <div>
            <p className="font-medium">{address.address}</p>

            <p className="text-muted-foreground">
              {address.ward.name}, {address.district.name}, {address.city.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-muted-foreground h-5 w-5" />

          <span>{address.recipientPhone}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyAddress() {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border">
      <MapPin
        className="text-muted-foreground mb-5 h-16 w-16"
        strokeWidth={1.5}
      />

      <h3 className="text-xl font-semibold">Bạn chưa có địa chỉ nào</h3>

      <p className="text-muted-foreground mt-2">
        Thêm địa chỉ để thanh toán nhanh hơn.
      </p>
    </div>
  )
}
