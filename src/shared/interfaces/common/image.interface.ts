import { Provider } from "@/shared/enums/provider.enum"

export interface IImage {
  key: string
  url: string
  provider: Provider
}
