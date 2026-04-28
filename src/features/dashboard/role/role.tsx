"use client"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFindAllRoles } from "@/hooks/use-role"
import { IRole } from "@/shared/interfaces/models/role.interface"
import { CircleCheckIcon, LoaderIcon } from "lucide-react"
import { groupByKeyGroup } from "../permisson/permission"
import { AddCard } from "./add-role"

function RoleCard({ role }: { role: IRole }) {
  const groupedPermissions = groupByKeyGroup(role.permissions)
  const store = role?.store

  return (
    <Card className="@container/card" key={role.id}>
      <CardHeader>
        <CardDescription>
          <Badge variant="outline">{role.permissions.length} permissions</Badge>
          {store && (
            <Badge variant="outline" className="ml-2">
              {store.name}
            </Badge>
          )}
        </CardDescription>
        <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {role.name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="max-h-[]calc(100vh-120px) flex-col items-start gap-1.5 overflow-y-auto text-sm">
        {Object.entries(groupedPermissions).map(([keyGroup, perms]) => (
          <div key={keyGroup} className="w-full">
            <p className="bg-muted mb-2 rounded-sm px-2 py-1 text-sm font-medium">
              {keyGroup}
            </p>
            {perms.map((perm) => (
              <div
                key={perm.id}
                className="flex items-center justify-between space-y-2"
              >
                <span className="text-sm">
                  {perm.code} - {perm.desc}
                </span>
                <Badge
                  variant="outline"
                  className="text-muted-foreground px-1.5"
                >
                  {perm.isActive ? (
                    <>
                      <CircleCheckIcon className="fill-green-400 dark:fill-green-300" />
                      Active
                    </>
                  ) : (
                    <>
                      <LoaderIcon />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
            ))}
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}

export function RolePage() {
  const { data } = useFindAllRoles()
  const role = data?.metadata || []

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <AddCard />
      {role.map((role) => (
        <RoleCard role={role} key={role.id} />
      ))}
    </div>
  )
}
