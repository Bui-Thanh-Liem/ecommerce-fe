import { CampaignCustomerPage } from "@/features/(public)/pages/campaign/campaign-customer-page"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params

  return <CampaignCustomerPage slug={slug} />
}
