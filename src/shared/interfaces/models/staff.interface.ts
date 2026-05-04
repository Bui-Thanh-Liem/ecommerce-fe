import { IBase } from "../common/base.interface"
import { IRole } from "./role.interface"
import { IStore } from "./store.interface"
import { ITeam } from "./team.interface"

export interface IStaff extends IBase {
  fullName: string
  email: string
  phone: string
  password: string
  isActive: boolean
  isSuperAdmin: boolean
  isStoreAdmin: boolean
  roles: IRole[]
  store: IStore | null // superAdmin thì null

  //
  managedStore?: IStore // Store mà Staff này quản lý (nếu có)
  teamMemberships?: ITeam[]
  teamsLed?: ITeam[]
}
