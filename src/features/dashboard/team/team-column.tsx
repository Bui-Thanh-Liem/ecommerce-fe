import { type ColumnDef } from "@tanstack/react-table"
import { Active } from "@/components/active"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IStaff } from "@/shared/interfaces/models/staff.interface"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUpdateTeam } from "@/hooks/use-team"

//
const StatusCell = ({ row }: { row: any }) => {
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
      return <Textarea readOnly>{row.original.desc}</Textarea>
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
      return <p>{row.original.leader?.fullName || "-"}</p>
    },
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const members = row.original.members
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
        {members.map((m) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <div className="cursor-pointer transition-all duration-200 hover:z-10 hover:-translate-y-1">
                <Avatar className="border-2 border-white shadow-sm">
                  <AvatarImage
                    src={m.avatarUrl || undefined}
                    alt={m.fullName}
                  />
                  <AvatarFallback>
                    {m.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
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
