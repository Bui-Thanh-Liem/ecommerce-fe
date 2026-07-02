import { AuditLogPage } from "@/features/(private)/management/audit-log/audit-log-page"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <Suspense fallback={<div>Loading...</div>}>
            <AuditLogPage />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
