import * as React from "react"
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface ComboboxOption extends Record<string, any> {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | string[]
  onChange?: (value: any) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  multiple?: boolean
  maxItems?: number
  className?: string
  renderItem?: (option: ComboboxOption) => React.ReactNode
  renderSelected?: (option: ComboboxOption) => React.ReactNode

  // === THÊM PROPS CHO REMOTE SEARCH ===
  onSearchChange?: (text: string) => void
  isLoading?: boolean
}

export function CustomCombobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  multiple = false,
  maxItems,
  className,
  renderItem,
  renderSelected,
  onSearchChange,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedValues = React.useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : []
    return typeof value === "string" && value ? [value] : []
  }, [value, multiple])

  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const updatedValues = selectedValues.includes(currentValue)
        ? selectedValues.filter((v) => v !== currentValue)
        : [...selectedValues, currentValue]

      if (
        maxItems &&
        updatedValues.length > maxItems &&
        !selectedValues.includes(currentValue)
      ) {
        return
      }
      onChange?.(updatedValues)
    } else {
      onChange?.(selectedValues.includes(currentValue) ? "" : currentValue)
      setOpen(false)
    }
  }

  const handleRemove = (e: React.MouseEvent, itemValue: string) => {
    e.stopPropagation()
    if (multiple) {
      onChange?.(selectedValues.filter((v) => v !== itemValue))
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-auto min-h-10 w-full justify-between px-3",
            className
          )}
        >
          <div className="flex max-w-[90%] flex-wrap items-center gap-1.5 text-left">
            {selectedValues.length > 0 ? (
              multiple ? (
                selectedValues.map((val) => {
                  const option = options.find((o) => o.value === val)
                  if (!option) return null
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="flex h-7 items-center gap-1 py-0.5 pr-1 pl-2"
                    >
                      {renderSelected ? renderSelected(option) : option.label}
                      <span
                        role="button"
                        tabIndex={0}
                        className="ring-offset-background focus:ring-ring ml-1 inline-flex cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2"
                        onMouseDown={(e) => handleRemove(e, val)}
                        onKeyDown={(e) => {
                          // Cho phép ấn Enter hoặc Space để xóa (tốt cho accessibility)
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleRemove(e as any, val)
                          }
                        }}
                      >
                        <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                      </span>
                    </Badge>
                  )
                })
              ) : (
                (() => {
                  const option = options.find(
                    (o) => o.value === selectedValues[0]
                  )
                  if (!option) return null
                  return renderSelected ? renderSelected(option) : option.label
                })()
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 self-center opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command
          // CRITICAL: Nếu có hàm onSearchChange (tức là dùng search từ BE), ta trả về true
          // để tắt tính năng filter local (client-side) mặc định của cmdk đi.
          shouldFilter={onSearchChange ? false : true}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onSearchChange} // Báo giá trị gõ ra ngoài
          />
          <CommandList>
            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          {renderItem ? (
                            renderItem(option)
                          ) : (
                            <span>{option.label}</span>
                          )}
                        </div>
                        <Check
                          className={cn(
                            "ml-2 h-4 w-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
