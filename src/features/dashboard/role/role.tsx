"use client"
import { Active } from "@/components/active"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFindAllRoles, useUpdateRole } from "@/hooks/use-role"
import { IRole } from "@/shared/interfaces/models/role.interface"
import { groupByKeyGroup } from "../permisson/permission"
import { RoleAdd } from "./role-add"

function RoleCard({ role }: { role: IRole }) {
  const updateRoleApi = useUpdateRole()

  const groupedPermissions = groupByKeyGroup(role.permissions)
  const store = role?.store

  //
  async function toggleRoleStatus(id: string, isActive: boolean) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    updateRoleApi.mutate({
      id: id,
      payload: {
        isActive: !isActive,
      },
    })
  }

  return (
    <Card className="@container/card" key={role.id}>
      <CardHeader>
        <Badge variant="outline">{role.permissions.length} permissions</Badge>
        {store && (
          <Badge variant="outline" className="ml-2">
            {store.name}
          </Badge>
        )}
        <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {role.name}
        </CardTitle>
        <CardDescription>{role.desc}</CardDescription>
        <CardAction>
          <span
            className="cursor-pointer"
            onClick={() => toggleRoleStatus(role.id, role.isActive)}
          >
            <Active isActive={role.isActive} />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-280px)] flex-col items-start gap-1.5 overflow-y-auto text-sm">
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
                <Active isActive={perm.isActive} />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RolePage() {
  const { data } = useFindAllRoles()
  const roles = data?.metadata || []

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <RoleAdd />
      {roles.map((role) => (
        <RoleCard role={role} key={role.id} />
      ))}
    </div>
  )
}
