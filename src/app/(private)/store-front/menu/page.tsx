import { MenuPage } from "@/features/(private)/store-front/menu/menu-page"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <MenuPage />
        </div>
      </div>
    </div>
  )
}
