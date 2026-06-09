import { HomePage } from "@/features/(public)/home/home-page"

export default function Page() {
  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <LayoutImage />

      {/* Main Content - Toàn bộ trang sẽ scroll */}
      <div className="relative z-10 grid grid-cols-12">
        {/* Left side - transparent */}
        <div className="col-span-2" />

        {/* Center Content - Không scroll riêng, để trang scroll */}
        <div className="col-span-8 bg-transparent">
          <HomePage />
        </div>

        {/* Right side - transparent */}
        <div className="col-span-2" />
      </div>
    </div>
  )
}

function LayoutImage() {
  return (
    <div
      id="layout-bg"
      className="fixed inset-0 -z-10 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/bg-mainv1.png')",
      }}
    >
      {/* Top Left Decoration */}
      <div
        id="layout-top-left"
        className="pointer-events-none fixed top-32 left-0 h-80 w-80 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/top-left.png')",
          backgroundSize: "contain",
        }}
      />

      {/* Bottom Left Decoration */}
      <div
        id="layout-bottom-left"
        className="pointer-events-none fixed bottom-12 left-0 h-80 w-80 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bottom-left.png')",
          backgroundSize: "contain",
        }}
      />

      {/* Bottom Right Decoration */}
      <div
        id="layout-bottom-right"
        className="pointer-events-none fixed right-4 bottom-0 h-80 w-80 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bottom-right.png')",
          backgroundSize: "contain",
        }}
      />
    </div>
  )
}
