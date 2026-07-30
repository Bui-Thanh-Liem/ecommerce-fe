"use client"
import Cookies from "js-cookie"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenerateLocation } from "@/features/(private)/inventory/store/generate-location"
import { Dialog, DialogContent, DialogFooterAction, DialogHeaderAction } from "@/components/ui/dialog"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useSelectionLocationRegion } from "@/hooks/apis/inventory/use-location-region"
import { useRLCustomerContext } from "@/context/region-location-customer.context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import z from "zod"
import { SelectLocationRegionSchema } from "@/shared/dtos/req/location-region.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

export function Address() {
  //
  const form = useForm<z.infer<typeof SelectLocationRegionSchema>>({
    resolver: zodResolver(SelectLocationRegionSchema),
    defaultValues: {
      country: "",
      wardCommune: "",
      provinceCity: "",
      districtTown: "",
      addressDetail: "",
    },
  })

  const { mutateAsync: selectionLocationRegion, isPending } = useSelectionLocationRegion()

  //
  const [coordinates, setCoordinates] = useState({ lat: 0, long: 0 })
  const { location, setLocation } = useRLCustomerContext()
  const [open, setOpen] = useState(false)

  //
  const handleOpenChange = (open: boolean) => {
    //
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        })
      },
      (error) => {
        toast.error("Không thể lấy vị trí hiện tại. Vui lòng chọn khu vực thủ công.")
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 0,
      }
    )

    setOpen?.(open)
    if (!open) {
      form.reset()
    }
  }

  //
  async function onSubmit(data: z.infer<typeof SelectLocationRegionSchema>) {
    //
    const session = Cookies.get("e_session")

    //
    const dataPersonal = { ...data, session, ...coordinates }
    const jsonString = encodeURIComponent(JSON.stringify(dataPersonal))

    //
    Cookies.set("e_personal", jsonString, {
      expires: 365,
      path: "/",
    })

    // Gọi api để BE xử lý về khu vực, cửa hàng gần nhất (khuyến mãi, ...)
    const res = await selectionLocationRegion()
    const location = res?.metadata
    if (res?.statusCode === 201 && location) {
      const { country, wardCommune, districtTown, provinceCity, addressDetail } = location
      setLocation(`${addressDetail}, ${districtTown?.name}, ${wardCommune?.name}, ${provinceCity?.name}, ${country?.name}`)

      //
      setOpen(false)
    }
  }

  const locationString = location || "Vui lòng chọn khu vực"

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
            <p className="line-clamp-1 max-w-42 truncate">{locationString}</p>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{locationString}</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeaderAction
            title="Chọn khu vực"
            desc="Vui lòng chọn tỉnh, thành phố để chúng tôi có thể cung cấp thông tin về khu vực, cửa hàng gần bạn nhất và các khuyến mãi liên quan."
          />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <GenerateLocation
              form={form as any}
              labelCountry="Quốc gia"
              labelProvinceCity="Tỉnh/Thành phố"
              labelDistrictTown="Quận/Huyện"
              labelWardCommune="Phường/Xã"
              placeholderCountry="Việt nam"
              placeholderProvinceCity="Thành phố Hồ Chí Minh"
              placeholderDistrictTown="Quận 1"
              placeholderWardCommune="Phường Bến Nghé"
            />
            <FieldGroup>
              <Controller
                name="addressDetail"
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
            <DialogFooterAction
              contentCancel="Hủy"
              isPending={isPending}
              contentOk="Chọn"
              contentPending="Đang tải các thông tin..."
              onClose={() => setOpen(false)}
            />
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
