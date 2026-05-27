import { IStaff } from "@/shared/interfaces/models/staff.interface"
import { Row, type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/apis/use-mobile"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Active } from "@/components/active"
import { Badge } from "@/components/ui/badge"
import { useUpdateStaff } from "@/hooks/apis/use-staff"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

//
const StatusCell = ({ row }: { row: Row<IStaff> }) => {
  const { mutate } = useUpdateStaff()

  function toggleActiveStatus() {
    mutate({
      id: row.original.id,
      payload: {
        isActive: !row.original.isActive,
      },
    })
  }

  return (
    <span className="cursor-pointer" onClick={toggleActiveStatus}>
      <Active isActive={row.original.isActive} />
    </span>
  )
}

export const staffColumns: ColumnDef<IStaff>[] = [
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage
            src={row.original.avatar?.url}
            alt={row.original.fullName}
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      )
    },
    enableHiding: false, // always show full name column
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false, // always show full name column
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <p>{row.original.email}</p>
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <p>{row.original.phone}</p>
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles.map((role) => role.name).join(", ")
      return <p>{roles || "-"}</p>
    },
  },
  {
    accessorKey: "store",
    header: "Store",
    cell: ({ row }) => {
      const isStoreAdmin = row.original.isStoreAdmin
      const storeName = row.original.store?.name || "-"
      return (
        <div>
          {storeName}{" "}
          {isStoreAdmin && (
            <Badge variant="outline" className="ml-2">
              Store Admin
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "directManager",
    header: "Direct Manager",
    cell: ({ row }) => {
      return <p>{row.original.directManager?.fullName || "-"}</p>
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <StatusCell row={row} />,
    enableHiding: false,
  },
]

function TableCellViewer({ item }: { item: IStaff }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left hover:underline"
        >
          {item.fullName}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            {item.fullName}
            <Active isActive={item.isActive} />
          </DrawerTitle>
          <DrawerDescription>Staff Details</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-6 text-sm">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <Avatar className="h-28 w-28 border">
                  <AvatarImage src={item.avatar?.url} alt={item.fullName} />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <InfoRow label="Full Name" value={item.fullName} />
                <InfoRow label="Email" value={item.email} />
                <InfoRow label="Phone" value={formatPhone(item.phone)} />
                <InfoRow label="Work Location ID" value={item.workLocationID} />
                {item.isStoreAdmin && (
                  <InfoRow
                    label="Store admin"
                    value={item.isStoreAdmin ? "Yes" : "No"}
                    className={
                      item.isStoreAdmin ? "text-green-500" : "text-red-500"
                    }
                  />
                )}
                {item.isSubAdmin && (
                  <InfoRow
                    label="Sub Admin"
                    value={item.isSubAdmin ? "Yes" : "No"}
                    className={
                      item.isSubAdmin ? "text-green-500" : "text-red-500"
                    }
                  />
                )}
                {item.isSuperAdmin && (
                  <InfoRow
                    label="Super Admin"
                    value={item.isSuperAdmin ? "Yes" : "No"}
                    className={
                      item.isSuperAdmin ? "text-green-500" : "text-red-500"
                    }
                  />
                )}
              </div>
            </div>

            {/* Store */}
            {item.store && (
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  Store
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium">{item.store?.name}</p>
                </div>
              </div>
            )}

            {/* Direct Manager */}
            {item.directManager && (
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  Direct Manager
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium">{item.directManager?.fullName}</p>
                </div>
              </div>
            )}

            {/* Roles */}
            {item.roles && item.roles.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-medium">
                  Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.roles.map((role: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {role.name || role.roleName || "N/A"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

/* ====================== Helper Components ====================== */

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string
  className?: string
  value: string | undefined
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-medium", className)}>
        {value || "—"}
      </span>
    </div>
  )
}

function formatPhone(phone: string | undefined): string {
  if (!phone) return "—"
  if (phone.startsWith("84")) {
    return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`
  }
  return phone
}
