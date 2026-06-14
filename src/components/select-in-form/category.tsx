import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field" // Giữ nguyên UI field của bạn
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { LayoutGrid } from "lucide-react"
import { useFindOptionsCategories } from "@/hooks/apis/catalog/use-category"
import { ICategory } from "@/shared/interfaces/models/catalog/category.interface"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function CategorySelectInForm({
  form,
  max = 5,
  multiple = false,
  name = "categories",
  label = "Categories",
}: SelectInFormProps) {
  //
  const [searchTerm, setSearchTerm] = useState("")

  const { data } = useFindOptionsCategories({ filters: { name: searchTerm } })
  const categoriesData = data?.metadata?.data || []

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
  const comboboxOptions = categoriesData.map((category: ICategory) => ({
    value: category.id,
    label: category.name,
    image: category.image,
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
                multiple ? "Select categories..." : "Select a category..."
              }
              searchPlaceholder="Search category name..."
              emptyMessage="No categories found."
              onSearchChange={handleSearchChange}
              //
              renderItem={(option) => (
                <div className="flex items-center gap-3 py-0.5 text-left">
                  {option.image ? (
                    <div className="relative h-10 w-10">
                      <Image
                        src={option.image.url}
                        alt={option.label}
                        fill
                        className="rounded-sm object-cover"
                      />
                    </div>
                  ) : (
                    <LayoutGrid size={16} className="text-muted-foreground" />
                  )}
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
                  <LayoutGrid className="size-3" />
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
