import { UseFormReturn } from "react-hook-form"

export interface SelectInFormProps {
  form: UseFormReturn<any>
  name?: string
  label?: string
  multiple?: boolean
  max?: number
}
