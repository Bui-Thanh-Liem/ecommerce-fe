"use client"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFindAllPermissions } from "@/hooks/use-permission"
import { IPermission } from "@/shared/interfaces/models/permission.interface"
import { CircleCheckIcon, LoaderIcon } from "lucide-react"

export function groupByKeyGroup(permissions: IPermission[]) {
  return permissions.reduce(
    (groups: Record<string, typeof permissions>, permission) => {
      const keyGroup = permission.keyGroup || "Khác"
      if (!groups[keyGroup]) {
        groups[keyGroup] = []
      }
      groups[keyGroup].push(permission)
      return groups
    },
    {}
  )
}

function PermissionCard({
  keyGroup,
  permission,
}: {
  keyGroup: string
  permission: IPermission[]
}) {
  return (
    <Card className="@container/card" key={keyGroup}>
      <CardHeader>
        <CardDescription>
          <Badge variant="outline">{permission.length} permissions</Badge>
        </CardDescription>
        <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {keyGroup}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {permission.length > 0 ? (
          <>
            {permission.map((perm) => (
              <div
                key={perm.id}
                className="line-clamp-1 flex w-full justify-between font-medium"
              >
                <p>
                  {perm.code} - {perm.desc}
                </p>
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
          </>
        ) : (
          <>No permissions found</>
        )}
      </CardFooter>
    </Card>
  )
}

export function PermissionPage() {
  const { data } = useFindAllPermissions()
  const permissions = data?.metadata || []
  const groupedPermissions = groupByKeyGroup(permissions)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Object.entries(groupedPermissions).map(([keyGroup, perms]) => (
        <PermissionCard keyGroup={keyGroup} permission={perms} key={keyGroup} />
      ))}
    </div>
  )
}
