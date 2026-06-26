import { ProductItem } from "@/components/product-item"
import { useFindOptionsCustomerProducts } from "@/hooks/apis/customer/use-customer-product"
import { CustomerProductType } from "@/shared/enums/customer-product-type.enum"

export function SuggestForYouSection() {
  //
  const { data } = useFindOptionsCustomerProducts(CustomerProductType.SUGGEST)
  const customerProducts = data?.metadata?.data || []

  //
  if (!customerProducts?.length) return null

  return (
    <div className="space-y-4 rounded-4xl bg-white p-4 px-6">
      <h2 className="text-xl font-bold text-sky-900">Gợi ý cho bạn</h2>
      <div className="grid grid-cols-5 gap-4">
        {customerProducts.map((cp) => (
          <ProductItem key={cp.id} variant={cp.productVariant} />
        ))}
      </div>
    </div>
  )
}
