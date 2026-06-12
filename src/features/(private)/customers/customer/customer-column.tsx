import { Active } from "@/components/active"
import { useUpdateCustomer } from "@/hooks/apis/customer/use-customer"
import { ICustomer } from "@/shared/interfaces/models/customer/customer.interface"
import { ColumnDef, Row } from "@tanstack/table-core"

//
const StatusCell = ({ row }: { row: Row<ICustomer> }) => {
  const { mutate } = useUpdateCustomer()

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

export const customerColumns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: "fullname",
    header: "Full Name",
    cell: ({ row }) => {
      const fullname = row.original.fullname || "-"
      return <span>{fullname}</span>
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone || "-"
      return <span>{phone}</span>
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email || "-"
      return <span>{email}</span>
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address?.join(", ") || "-"
      return <span>{address}</span>
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <StatusCell row={row} />,
    enableHiding: false,
  },
]
