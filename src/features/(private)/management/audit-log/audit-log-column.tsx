import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AuditLogStatus } from "@/shared/enums/audit-log-status.enum"
import { IAuditLog } from "@/shared/interfaces/models/management/audit-log.interface"
import { ColumnDef } from "@tanstack/react-table"

export const auditLogColumns: ColumnDef<IAuditLog>[] = [
  {
    accessorKey: "username",
    header: "Info Staff",
    cell: ({ row }) => {
      const dataMap = {
        ["Username"]: (
          <span className="bg-sky-100">{row.original.username}</span>
        ),
        ["Email"]: row.original.email,
        ["Phone"]: row.original.phone,
        ["IP Address"]: row.original.ipAddress,
        ["User Agent"]: row.original.userAgent,
        ["Action"]: <TransformMethod method={row.original.method} />,
      }

      return (
        <div className="space-y-1">
          {Object.entries(dataMap).map(([label, value]) => (
            <p key={label}>
              {label}: <strong>{value || "-"}</strong>
            </p>
          ))}
        </div>
      )
    },
  },

  {
    accessorKey: "endpoint",
    header: "Info Action",
    cell: ({ row }) => {
      const log = row.original
      const dataMap = {
        ["Endpoint"]: <span className="bg-sky-100">{log.endpoint}</span>,
        ["Method"]: log.method,
        ["Status Code"]: (
          <span
            className={cn(
              log.statusCode > 320 ? "text-destructive" : "text-green-500"
            )}
          >
            {log.statusCode}
          </span>
        ),
        ["Message"]: log.desc,
        ["Final Status"]: <TransformStatus status={log.status} />,
        ["Time"]: new Date(log.createdAt).toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "medium",
        }),
      }

      return (
        <div className="space-y-1">
          {Object.entries(dataMap).map(([label, value]) => (
            <p key={label}>
              {label}: <strong>{value || "-"}</strong>
            </p>
          ))}
        </div>
      )
    },
  },

  {
    accessorKey: "requestPayload",
    header: "Payload",
    cell: ({ row }) => {
      const log = row.original
      return (
        <div className="w-140 space-y-4">
          <div>
            <span className="mb-1 block font-semibold">Request Payload:</span>
            <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-3 text-sm">
              <code>
                {JSON.stringify(JSON.parse(log.requestPayload), null, 2)}
              </code>
            </pre>
          </div>

          <div>
            <span className="mb-1 block font-semibold">Response Payload:</span>
            <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-3 text-sm">
              <code>
                {JSON.stringify(JSON.parse(log.responsePayload), null, 2)}
              </code>
            </pre>
          </div>
        </div>
      )
    },
  },
]

function TransformMethod({ method }: { method: string }) {
  switch (method) {
    case "GET":
      return <Badge variant="secondary">View</Badge>
    case "POST":
      return <Badge variant="destructive">Create</Badge>
    case "PATCH":
      return <Badge variant="destructive">Update</Badge>
    case "PUT":
      return <Badge variant="destructive">Update</Badge>
    case "DELETE":
      return <Badge variant="destructive">Delete</Badge>
    default:
      return method
  }
}

function TransformStatus({ status }: { status: AuditLogStatus }) {
  switch (status) {
    case AuditLogStatus.SUCCESS:
      return <Badge className="bg-green-100 text-green-800">Success</Badge>
    case AuditLogStatus.FAILURE:
      return <Badge className="bg-red-100 text-red-800">Failure</Badge>
    default:
      return status
  }
}
