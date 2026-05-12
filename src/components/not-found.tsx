import { ShoppingBag } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function NotFound({
  title,
  description,
}: {
  title?: string
  description?: string
}) {
  const router = useRouter()

  function onClick() {
    router.back()
  }

  return (
    <div className="flex h-full items-center justify-center overflow-hidden p-5 font-sans text-[#999]">
      <div className="max-w-150 text-center">
        {/* Logo Section */}
        <div className="mb-20 flex items-center justify-center">
          <ShoppingBag className="size-32" />
        </div>

        {/* Error Code */}
        <div className="hover:animate-subtle-glitch mb-2.5 animate-bounce cursor-default bg-linear-to-b from-white to-[#333] bg-clip-text text-[120px] leading-none font-black -tracking-[5px] text-transparent select-none">
          404
        </div>

        {/* Messages */}
        <h1 className="mb-2.5 text-xl font-normal text-[#71767b]">
          {title || "Page Not Found"}
        </h1>
        <p className="mb-7.5 text-[15px] leading-5 text-[#71767b]">
          {description ||
            "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </p>

        {/* Button */}
        <Button onClick={onClick}>Go Back</Button>
      </div>
    </div>
  )
}
