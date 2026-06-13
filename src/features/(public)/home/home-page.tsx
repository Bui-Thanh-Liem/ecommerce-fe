import { CategoryList } from "./category-list"
import { CustomerHistory } from "./customer-history"
import { MainBanner } from "./main-banner"
import { OnlinePromotion } from "./online-promotion/online-promotion"

export function HomePage() {
  return (
    <div className="space-y-6 py-8">
      <MainBanner />
      <CategoryList />
      <CustomerHistory />
      <OnlinePromotion />
    </div>
  )
}
