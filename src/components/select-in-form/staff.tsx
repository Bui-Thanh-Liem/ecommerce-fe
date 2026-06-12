import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field" // Giữ nguyên UI field của bạn
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { useFindOptionsStaffs } from "@/hooks/apis/management/use-staff"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useRef, useState } from "react"
import { IStaff } from "@/shared/interfaces/models/management/staff.interface"

export function StaffSelectInForm({
  form,
  max = 5,
  name = "staffs",
  label = "Staffs",
  multiple = false,
}: SelectInFormProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const { data } = useFindOptionsStaffs({ filters: { fullName: searchTerm } })
  const staffsData = data?.metadata?.data || []
  console.log("staffsData", staffsData)

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
  const comboboxOptions = staffsData.map((staff: IStaff) => ({
    value: staff.id,
    label: staff.fullName,
    email: staff.email,
    avatar: staff.avatar,
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
              placeholder={multiple ? "Select staffs..." : "Select a staff..."}
              searchPlaceholder="Search staff name..."
              emptyMessage="No staffs found."
              onSearchChange={handleSearchChange}
              renderItem={(option) => (
                <div className="flex items-center gap-3 py-0.5 text-left">
                  <Avatar>
                    <AvatarImage
                      src={option?.avatar?.url}
                      alt={option?.fullName}
                    />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {option.label}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {option.email}
                    </span>
                  </div>
                </div>
              )}
              renderSelected={(option) => (
                <div className="flex items-center gap-1.5 text-xs font-normal">
                  <Avatar className="size-3">
                    <AvatarImage
                      src={option?.avatar?.url}
                      alt={option?.fullName}
                    />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
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
