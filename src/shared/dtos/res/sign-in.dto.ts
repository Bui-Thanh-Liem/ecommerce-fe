import { ICustomer } from "@/shared/interfaces/models/customer/customer.interface"
import { IStaff } from "@/shared/interfaces/models/management/staff.interface"

export interface ResSignInStaffDto {
  staff: IStaff
}

export interface ResLoginCustomerDto {
  customer: ICustomer
}
