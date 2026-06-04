import { Active } from "@/components/active"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUpdateTeam } from "@/hooks/apis/use-team"
import { IStaff } from "@/shared/interfaces/models/staff.interface"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { Row, type ColumnDef } from "@tanstack/react-table"

//
const StatusCell = ({ row }: { row: Row<ITeam> }) => {
  const { mutate } = useUpdateTeam()

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

export const teamColumns: ColumnDef<ITeam>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p>{row.original.name}</p>
    },
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      return <Textarea readOnly value={row.original.desc} />
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <p>{row.original.category?.name || "-"}</p>
    },
  },
  {
    accessorKey: "store",
    header: "Store",
    cell: ({ row }) => {
      const storeName = row.original.store?.name || "-"
      return <div>{storeName} </div>
    },
  },
  {
    accessorKey: "leader",
    header: "Leader",
    cell: ({ row }) => {
      const leader = row.original.leader
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="border-2 border-white shadow-sm">
            <AvatarImage
              src={leader.avatar?.url || undefined}
              alt={leader.fullName}
            />
            <AvatarFallback>{leader.fullName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <p>{leader.fullName}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const members = row.original.members
      if (!members?.length) return <p>-</p>
      return <MemberAvatars members={members} />
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <StatusCell row={row} />,
    enableHiding: false,
  },
]

export function MemberAvatars({ members }: { members: IStaff[] }) {
  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {members?.map((m) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <div className="cursor-pointer transition-all duration-200 hover:z-10 hover:-translate-y-1">
                <Avatar className="border-2 border-white shadow-sm">
                  <AvatarImage
                    src={m.avatar?.url || undefined}
                    alt={m.fullName}
                  />
                  <AvatarFallback>{m.fullName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>

            <TooltipContent side="top">
              <div className="flex flex-col">
                <span className="font-medium">{m.fullName}</span>
                <span className="text-muted-foreground text-xs">{m.email}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
