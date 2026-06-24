export function CampaignCustomerPage({ slug }: { slug: string }) {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8">
        <h1 className="text-2xl font-semibold">Campaign Page: {slug}</h1>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
