import { IBase } from "../../common/base.interface"
import { ITopBanner } from "@/shared/interfaces/models/store-front/top-banner.interface"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import { IMainBanner } from "@/shared/interfaces/models/store-front/main-banner.interface"
import { ICategory } from "@/shared/interfaces/models/catalog/category.interface"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"
import { IPopularSearch } from "./popular-search.interface"

export interface IStoreFrontConfig extends IBase {
  homeConfig: IConfigHome
}

export interface IConfigHome {
  order: (keyof IDetailHomeConfig)[] // Mảng chứa thứ tự các block, ví dụ: ["topBanner", "header", "menu", ...]
  config: IDetailHomeConfig // Đối tượng chứa cấu hình chi tiết cho từng block
}

export type TopBannerOption = Pick<
  ITopBanner,
  "id" | "slug" | "title" | "image"
>

export type CategoryOption = Pick<
  ICategory,
  "id" | "slug" | "name" | "image" | "minPrice"
>

export type MainBannerOption = Pick<
  IMainBanner,
  "id" | "slug" | "title" | "image"
>

export type MenuOption = Pick<IMenu, "id" | "slug" | "name" | "link">

export type MktProgramOption = Pick<
  IMarketingProgram,
  "id" | "slug" | "name" | "mainImage"
>

export type CampaignOption = Pick<
  ICampaign,
  "id" | "slug" | "name" | "mainImage"
>

export type PopularSearchOption = Pick<IPopularSearch, "id" | "text">

export interface IDetailHomeConfig {
  topBanner: TopBannerOption | null
  header: string // Không có đối tượng cấu hình động cho header
  menu: MenuOption[]
  mainBanner: MainBannerOption[]
  listCategories: CategoryOption[]
  historyProducts: string // Không có đối tượng cấu hình động cho historyProducts
  marketingProgram01: {
    title: string
    mktPrograms: MktProgramOption[]
  }
  marketingProgram02: {
    campaigns: CampaignOption[]
  }
  marketingProgram03: {
    title: string
    mktPrograms: MktProgramOption[]
  }
  suggestForYou: string // Không có đối tượng cấu hình động cho suggestForYou
  marketingProgram04: {
    title: string
    campaign: CampaignOption
  }
  marketingProgram05: {
    title: string
    campaign: CampaignOption
  }
  marketingProgram06: {
    title: string
    campaigns: CampaignOption[]
  }
  popularSearch: {
    title: string
    searches: PopularSearchOption[]
  }
}
