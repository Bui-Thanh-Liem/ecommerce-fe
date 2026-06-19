import { useFindStoreFrontConfig } from "./apis/store-front/use-store-front-config"

export function useGetStoreFront() {
  const { data, isLoading, isFetching, isPending } = useFindStoreFrontConfig()
  const order = data?.metadata?.homeConfig?.order || []
  const topBanner = data?.metadata?.homeConfig?.config?.topBanner
  const menus = data?.metadata?.homeConfig?.config?.menu || []
  const mainBanner = data?.metadata?.homeConfig?.config?.mainBanner || []
  const listCategories = data?.metadata?.homeConfig?.config?.listCategories || []
  const marketingProgram01 = data?.metadata?.homeConfig?.config?.marketingProgram01 || []
  const marketingProgram02 = data?.metadata?.homeConfig?.config?.marketingProgram02
  const marketingProgram03 = data?.metadata?.homeConfig?.config?.marketingProgram03
  const popularSearch = data?.metadata?.homeConfig?.config?.popularSearch
  const suggestForYou = data?.metadata?.homeConfig?.config?.suggestForYou
  const marketingProgram04 = data?.metadata?.homeConfig?.config?.marketingProgram04
  const marketingProgram05 = data?.metadata?.homeConfig?.config?.marketingProgram05
  const marketingProgram06 = data?.metadata?.homeConfig?.config?.marketingProgram06


  return {
    order,
    topBanner,
    menus,
    mainBanner,
    listCategories,
    marketingProgram01,
    marketingProgram02,
    marketingProgram03,
    suggestForYou,
    popularSearch,
    marketingProgram04,
    marketingProgram05,
    marketingProgram06,
    isLoading: isLoading || isPending || isFetching,
  }
}
