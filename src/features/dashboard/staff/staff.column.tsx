import { IStaff } from "@/shared/interfaces/models/staff.interface"
import { type ColumnDef } from "@tanstack/react-table"
import { DragHandle } from "@/components/data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { EllipsisVerticalIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
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
import { useUpdateStaff } from "@/hooks/use-staff"

//
const StatusCell = ({ row }: { row: any }) => {
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

export const columns: ColumnDef<IStaff>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
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
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-muted-foreground data-[state=open]:bg-muted flex size-8"
            size="icon"
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function TableCellViewer({ item }: { item: IStaff }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.fullName}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.isSuperAdmin}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <div>
                <p>
                  <span className="font-medium">Note:</span> This is a read-only
                  view of the staff details. To make changes, please use the
                  edit option in the actions menu.
                </p>
              </div>
            </>
          )}
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod, nisl vel tincidunt lacinia, nunc est aliquam nunc, eget
              aliquam nisl nunc vel nisl. Sed euismod, nisl vel tincidunt
              lacinia, nunc est aliquam nunc, eget aliquam nisl nunc vel nisl.
            </p>
          </div>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
