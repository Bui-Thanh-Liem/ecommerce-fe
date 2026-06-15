"use client"
import Cookies from "js-cookie"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenerateLocation } from "@/features/(private)/inventory/store/generate-location"
import {
  Dialog,
  DialogContent,
  DialogFooterAction,
  DialogHeaderAction,
} from "@/components/ui/dialog"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useSelectionLocationRegion } from "@/hooks/apis/inventory/use-location-region"
import { useRLCustomerContext } from "@/context/region-location-customer.context"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Address() {
  //
  const form = useForm({
    defaultValues: {
      country: "",
      provinceCity: "",
      districtTown: "",
      wardCommune: "",
      addressDetail: "",
    },
  })

  const { mutateAsync: selectionLocationRegion, isPending } =
    useSelectionLocationRegion()

  //
  const { location, setLocation } = useRLCustomerContext()
  const [open, setOpen] = useState(false)

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      form.reset()
    }
  }

  //
  async function onSubmit(data: any) {
    //
    const session = Cookies.get("e_session")

    //
    const dataPersonal = { ...data, session }
    const jsonString = encodeURIComponent(JSON.stringify(dataPersonal))

    //
    Cookies.set("e_personal", jsonString, {
      expires: 365,
      path: "/",
    })

    // Gọi api để BE xử lý về khu vực, cửa hàng gần nhất (khuyến mãi, ...)
    const res = await selectionLocationRegion()
    if (res?.statusCode === 201 && res.metadata) {
      form.reset()
      setOpen(false)
      setLocation(
        `${res.metadata.addressDetail}, ${res.metadata.districtTown.name}, ${res.metadata.wardCommune.name}`
      )
    }
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => setOpen(true)}
            className="ml-4 flex-1 cursor-pointer bg-sky-50/20 text-white hover:bg-sky-50/30 hover:text-white data-[state=open]:bg-sky-50/30"
          >
            <MapPin />
            <p className="line-clamp-1 max-w-42">
              {location || "Vui lòng chọn địa chỉ giao hàng"}
            </p>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{location}</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeaderAction
            title="Chọn địa chỉ giao hàng"
            desc="Vui lòng chọn địa chỉ giao hàng để chúng tôi có thể cung cấp thông tin về khu vực, cửa hàng gần bạn nhất và các khuyến mãi liên quan."
          />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="addressDetail"
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
              contentCancel="Hủy"
              isPending={isPending}
              contentOk="Lưu thay đổi"
              contentPending="Đang lưu..."
              onClose={() => setOpen(false)}
            />
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
