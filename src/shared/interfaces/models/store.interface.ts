import { IBase } from "../common/base.interface"
import { IImage } from "../common/image.interface"
import { IPhoneStore } from "../common/phone-store.interface"
import { IInventory } from "./inventory.interface"
import { ILocationRegion } from "./location-region.interface"
import { IStaff } from "./staff.interface"
import { IVoucher } from "./voucher.interface"

// (1 store / 1 warehouse)
export interface IStore extends IBase {
  country: ILocationRegion
  provinceCity: ILocationRegion
  districtTown: ILocationRegion
  wardCommune: ILocationRegion
  address: string
  name: string
  image?: IImage
  phone: IPhoneStore[]
  openingHours: string // Ví dụ: "8:00 AM - 10:00 PM"
  closingHours: string // Ví dụ: "8:00 AM - 10:00 PM"
  lat: number // Vĩ độ
  lng: number // Kinh độ
  isActive: boolean // Cửa hàng có đang hoạt động hay không
  manager: IStaff // Quản lý cửa hàng (có thể là một staff có vai trò quản lý)

  // Quan hệ
  staffs: IStaff[]
  inventories?: IInventory[] // Danh sách tồn kho của cửa hàng (nếu cần)
  vouchers?: IVoucher[] // Danh sách voucher áp dụng cho cửa hàng (nếu cần)
}
