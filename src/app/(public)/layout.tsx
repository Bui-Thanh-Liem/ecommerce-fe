import { Footer } from "@/features/(public)/footer/footer"
import { Header } from "@/features/(public)/header/header"
import { Navbar } from "@/features/(public)/navbar/navbar"
import { TopBanner } from "@/features/(public)/top-banner/top-banner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <TopBanner />
      <Header />
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}
