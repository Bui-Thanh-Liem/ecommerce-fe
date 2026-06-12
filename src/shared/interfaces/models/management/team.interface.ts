import { IBase } from "../../common/base.interface"
import { IStaff } from "./staff.interface"
import { IStore } from "../inventory/store.interface"
import { ITeamCategory } from "./team-category.interface"

export interface ITeam extends IBase {
  name: string
  desc: string
  store: IStore
  leader: IStaff
  members: IStaff[]
  isActive: boolean
  category: ITeamCategory
}
