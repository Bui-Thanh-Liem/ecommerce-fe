import { Row, type ColumnDef } from "@tanstack/react-table"
import { IStore } from "@/shared/interfaces/models/store.interface"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUpdateStore } from "@/hooks/apis/use-store"
import { Active } from "@/components/active"
import { Textarea } from "@/components/ui/textarea"

const StatusCell = ({ row }: { row: Row<IStore> }) => {
  const { mutate } = useUpdateStore()

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

export const storeColumns: ColumnDef<IStore>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const store = row.original

      return (
        <div className="flex items-center justify-center gap-x-2">
          <Avatar className="size-14">
            <AvatarImage src={store.image?.url} />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p>{store.name}</p>
            <p>{`${store.openingHours} - ${store.closingHours}`}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "provinceCity",
    header: "Location",
    cell: ({ row }) => {
      const country = row.original.country
      const provinceCity = row.original.provinceCity
      const districtTown = row.original.districtTown
      const wardCommune = row.original.wardCommune
      return (
        <div className="space-y-1">
          <p>{`${country.name} ${provinceCity.name}, ${districtTown.name}, ${wardCommune.name}`}</p>
          <p>{`Lat: ${row.original.lat} - Lng: ${row.original.lng}`}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const store = row.original

      return (
        <div>
          <Textarea readOnly>{store.address}</Textarea>
        </div>
      )
    },
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => {
      const store = row.original

      return (
        <div>
          <p>{store.manager.fullName}</p>
        </div>
      )
    },
  },

  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone
      return (
        <div>
          {phone.map((p) => (
            <div key={p.phone}>
              <p>
                {p.name}: {p.phone}
              </p>
            </div>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <StatusCell row={row} />,
    enableHiding: false,
  },
]
