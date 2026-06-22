import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

export function ProductVariantListPage({
  productSlug,
  categorySlug,
}: {
  productSlug: string
  categorySlug: string
}) {
  return (
    <div className="grid grid-cols-12 bg-gray-50">
      <div className="col-span-2"></div>
      <div className="col-span-8 py-8">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home size={18} />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${categorySlug}`}>
                  {categorySlug}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
