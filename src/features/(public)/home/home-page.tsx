import { CategoryList } from "./category-list"
import { CustomerHistory } from "./customer-history"
import { MainBanner } from "./main-banner"

export function HomePage() {
  return (
    <div className="space-y-6 py-8">
      <MainBanner />
      <CategoryList />
      <CustomerHistory />
      <div className="h-96 rounded-xl bg-white shadow-sm"></div>
      <div className="h-96 rounded-xl bg-white shadow-sm"></div>
      <div className="h-96 rounded-xl bg-white shadow-sm"></div>
      <div className="h-96 rounded-xl bg-white shadow-sm"></div>
      <div className="h-96 rounded-xl bg-white shadow-sm"></div>
      <div className="h-96 rounded-xl bg-white shadow-sm"></div>
      <div className="h-96 rounded-xl bg-white shadow-sm"></div>
    </div>
  )
}
