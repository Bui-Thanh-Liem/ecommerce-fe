import { Header } from "@/features/(public)/header/header"
import { Navbar } from "@/features/(public)/navbar/navbar"
import { TopBanner } from "@/features/(public)/top-banner/top-banner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8">
        <TopBanner />
        <Header />
        <Navbar />
        {children}
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
