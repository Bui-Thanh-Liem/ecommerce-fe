"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "./calendar"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface DatePickerTimeProps {
  value?: Date
  onChange?: (value?: Date) => void
  id?: string
  "aria-invalid"?: boolean
}

export function DatePickerTime({
  value,
  onChange,
  id,
  "aria-invalid": ariaInvalid,
}: DatePickerTimeProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateChange = (selected?: Date) => {
    if (!selected) {
      onChange?.(undefined)
      return
    }

    const next = new Date(selected)

    // giữ lại giờ hiện tại nếu đã chọn trước đó
    if (value) {
      next.setHours(value.getHours())
      next.setMinutes(value.getMinutes())
      next.setSeconds(value.getSeconds())
    }

    onChange?.(next)
    setOpen(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value // 08:30 hoặc 08:30:00
    const [h = "0", m = "0", s = "0"] = time.split(":")

    const next = value ? new Date(value) : new Date()

    next.setHours(Number(h))
    next.setMinutes(Number(m))
    next.setSeconds(Number(s))

    onChange?.(next)
  }

  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(
        value.getMinutes()
      ).padStart(2, "0")}:${String(value.getSeconds()).padStart(2, "0")}`
    : "00:00:00"

  return (
    <FieldGroup className="grid grid-cols-2 gap-2">
      <Field>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            >
              {value ? format(value, "PPP") : "Select date"}
              <ChevronDownIcon className="size-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              defaultMonth={value}
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field>
        <Input
          id={id}
          type="time"
          step="1"
          value={timeValue}
          onChange={handleTimeChange}
          aria-invalid={ariaInvalid}
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
