import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field" // Giữ nguyên UI field của bạn
import { useFindOptionsStores } from "@/hooks/apis/inventory/use-store"
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { Store } from "lucide-react"
import { IStore } from "@/shared/interfaces/models/inventory/store.interface"
import Image from "next/image"

export function StoreSelectInForm({
  form,
  max = 5,
  name = "stores",
  label = "Stores",
  multiple = false,
}: SelectInFormProps) {
  const { data } = useFindOptionsStores()
  const storesData = data?.metadata?.data || []

  // Khớp định dạng data đầu vào cho Combobox [{ value, label }]
  const comboboxOptions = storesData.map((store: IStore) => ({
    value: store.id,
    label: store.name,
    image: store.image,
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
              placeholder={multiple ? "Select stores..." : "Select a store..."}
              searchPlaceholder="Search store name..."
              emptyMessage="No stores found."
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
                  <Store className="size-3" />
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
