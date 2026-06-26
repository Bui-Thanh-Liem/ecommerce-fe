import { MktProgramPage } from "@/features/(public)/pages/mkt-program/mkt-program-page"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params

  return <MktProgramPage slug={slug} />
}
