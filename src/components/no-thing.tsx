import { BrushCleaning } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function Nothing() {
  const router = useRouter()

  function onClick() {
    router.back()
  }

  return (
    <div className="flex h-full items-center justify-center overflow-hidden p-5 font-sans text-[#999]">
      <div className="max-w-150 text-center">
        {/* Logo Section */}
        <div className="mb-12 flex items-center justify-center">
          <BrushCleaning className="size-24" />
        </div>

        {/* Messages */}
        <h1 className="mb-2.5 text-xl font-normal text-[#71767b]">
          Unfortunately, there&#39;s nothing here!
        </h1>
        <p className="mb-7.5 text-[15px] leading-5 text-[#71767b]">
          The content you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Button */}
        <Button onClick={onClick}>Go Back</Button>
      </div>
    </div>
  )
}
