import { ProductNavbarPage } from "@/features/(private)/catalog/product-navbar/product-navbar-page"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <ProductNavbarPage />
        </div>
      </div>
    </div>
  )
}
