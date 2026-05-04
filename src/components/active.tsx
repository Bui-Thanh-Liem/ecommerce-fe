import { CircleCheckIcon, CircleX, X } from "lucide-react"
import { Badge } from "./ui/badge"

export function Active({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      {isActive ? (
        <>
          <CircleCheckIcon className="fill-green-400 dark:fill-green-300" />
          Active
        </>
      ) : (
        <>
          <CircleX className="fill-red-400 dark:fill-red-300" />
          Inactive
        </>
      )}
    </Badge>
  )
}
