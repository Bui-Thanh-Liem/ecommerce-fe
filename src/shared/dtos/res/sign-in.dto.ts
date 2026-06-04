import { ICustomer } from "@/shared/interfaces/models/customer.interface"
import { IStaff } from "@/shared/interfaces/models/staff.interface"

export interface ResSignInStaffDto {
  staff: IStaff
  token: string
}

export interface ResLoginCustomerDto {
  customer: ICustomer
  token: string
}
