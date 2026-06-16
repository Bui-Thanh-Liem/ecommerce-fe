import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field" // Giữ nguyên UI field của bạn
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { BadgeIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useFindOptionsTopBanners } from "@/hooks/apis/store-front/use-top-banner"
import { ITopBanner } from "@/shared/interfaces/models/store-front/top-banner.interface"

export function TopBannerSelectInForm({
  form,
  max = 5,
  enabled = true,
  multiple = false,
  name = "top-banners",
  label = "Top Banners",
}: SelectInFormProps) {
  //
  const [searchTerm, setSearchTerm] = useState("")

  //
  const { data } = useFindOptionsTopBanners({
    enabled: !!searchTerm || enabled,
    query: { filters: { title: searchTerm } },
  })
  const topBannerData = data?.metadata?.data || []

  //
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  //
  const handleSearchChange = (text: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setSearchTerm(text)
    }, 400) // 400ms debounce time
  }

  // Dọn dẹp timeout nếu component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Khớp định dạng data đầu vào cho Combobox [{ value, label }]
  const comboboxOptions = topBannerData.map((topBanner: ITopBanner) => ({
    value: topBanner.id,
    label: topBanner.title,
    image: topBanner.image,
  }))

  return (
    <FieldGroup>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{label}</FieldLabel>

            <CustomCombobox
              options={comboboxOptions}
              value={field.value}
              onChange={field.onChange}
              multiple={multiple}
              maxItems={max}
              placeholder={
                multiple ? "Select top banners..." : "Select a top banner..."
              }
              searchPlaceholder="Search top banner name..."
              emptyMessage="No top banners found."
              onSearchChange={handleSearchChange}
              //
              renderItem={(option) => (
                <div className="relative h-12 w-full overflow-hidden rounded-2xl">
                  <Image fill alt={option.label} src={option.image?.url} />
                </div>
              )}
              //
              renderSelected={(option) => (
                <div className="flex items-center gap-1.5 text-xs font-normal">
                  <Image
                    width={400}
                    height={100}
                    alt={option.label}
                    src={option.image?.url}
                  />
                  <span className="max-w-36 truncate">{option.label}</span>
                </div>
              )}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  )
}
