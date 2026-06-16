import { IBase } from "../../common/base.interface"
import { ITopBanner } from "@/shared/interfaces/models/store-front/top-banner.interface"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import { IMainBanner } from "@/shared/interfaces/models/store-front/main-banner.interface"
import { ICategory } from "@/shared/interfaces/models/catalog/category.interface"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"

export interface IStoreFrontConfig extends IBase {
  homeConfig: IConfigHome
}

export interface IConfigHome {
  order: (keyof IDetailHomeConfig)[] // Mảng chứa thứ tự các block, ví dụ: ["topBanner", "header", "menu", ...]
  config: IDetailHomeConfig // Đối tượng chứa cấu hình chi tiết cho từng block
}

export interface IDetailHomeConfig {
  topBanner: Partial<ITopBanner>
  header: string // Không có đối tượng cấu hình động cho header
  menu: Partial<IMenu>[]
  mainBanner: Partial<IMainBanner>[]
  listCategories: Partial<ICategory>[]
  historyProducts: Partial<IProductVariant>[]
  mktSessionOne: {
    title: string
    mktPrograms: Partial<IMarketingProgram>[]
  }
  mktSessionTwo: {
    title: string
    mktPrograms: Partial<IMarketingProgram>[]
  }
  suggestForYou: Partial<IProductVariant>[]
  mktSessionThree: {
    title: string
    campaign: Partial<ICampaign>
  }
  mktSessionFour: {
    title: string
    campaign: Partial<ICampaign>
  }
  mktSessionFive: {
    title: string
    campaigns: Partial<ICampaign>[]
  }
  topic: {
    title: string
    topics: string[]
  }
}
