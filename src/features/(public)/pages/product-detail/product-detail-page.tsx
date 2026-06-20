"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useFindProductBySlug } from "@/hooks/apis/catalog/use-product"
import { Home } from "lucide-react"

export function ProductDetailPage({
  categorySlug,
  productSlug,
  variantSlug,
}: {
  categorySlug: string
  productSlug: string
  variantSlug: string
}) {
  const { data: productRes, isLoading } = useFindProductBySlug(productSlug)
  const product = productRes?.metadata

  console.log("product detail", product)

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8 space-y-4 py-6">
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${categorySlug}/${productSlug}`}>
                {productSlug}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="font-bold">{variantSlug}</h2>

        <div className="grid grid-cols-3 gap-x-6">
          <div className="col-span-2 h-96 rounded-2xl bg-gray-50 p-4"></div>
          <div className="col-span-1 h-96 rounded-2xl bg-gray-50 p-4"></div>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
