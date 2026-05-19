import { IStaff } from "@/shared/interfaces/models/staff.interface"

export interface ResSignInDto {
  staff: IStaff
  token: string
}
