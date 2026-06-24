import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field" // Giữ nguyên UI field của bạn
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { Target } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useFindOptionsCampaigns } from "@/hooks/apis/mkt-program/use-campaign"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"

export function CampaignSelectInForm({
  form,
  max = 5,
  name = "campaigns",
  label = "Campaigns",
  multiple = false,
}: SelectInFormProps) {
  //
  const [searchTerm, setSearchTerm] = useState("")

  const { data } = useFindOptionsCampaigns({
    filters: { name: searchTerm },
    page: 1,
    limit: 50,
  })
  const campaignsData = data?.metadata?.data || []

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
  const comboboxOptions = campaignsData.map((campaign: ICampaign) => ({
    value: campaign.id,
    label: campaign.name,
    image: campaign.mainImage,
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
                multiple ? "Select campaigns..." : "Select a campaign..."
              }
              searchPlaceholder="Search campaign name..."
              emptyMessage="No campaigns found."
              onSearchChange={handleSearchChange}
              //
              renderItem={(option) => (
                <div className="flex items-center gap-3 py-0.5 text-left">
                  <Image
                    src={option.image?.url}
                    alt={option.label}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {option.label}
                    </span>
                  </div>
                </div>
              )}
              //
              renderSelected={(option) => (
                <div className="flex items-center gap-1.5 text-xs font-normal">
                  <Target className="size-3" />
                  <span className="max-w-25 truncate">{option.label}</span>
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
