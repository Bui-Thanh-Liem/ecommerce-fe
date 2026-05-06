"use client"
import { Active } from "@/components/active"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  useFindAllPermissions,
  useUpdatePermission,
} from "@/hooks/use-permission"
import { UpdatePermissionSchema } from "@/shared/dtos/req/permission.dto"
import { IPermission } from "@/shared/interfaces/models/permission.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

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
  const [openInputKeyGroup, setOpenInputKeyGroup] = useState(false)
  const updatePermissionApi = useUpdatePermission()

  // 1. Tạo ref
  const formRef = useRef<HTMLFormElement>(null)

  // 2. Logic xử lý click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpenInputKeyGroup(false)
      }
    }

    if (openInputKeyGroup) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openInputKeyGroup])

  //
  const form = useForm<z.infer<typeof UpdatePermissionSchema>>({
    resolver: zodResolver(UpdatePermissionSchema),
    defaultValues: {
      keyGroup: keyGroup,
    },
  })

  //
  async function togglePermissionStatus(id: string, isActive: boolean) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    updatePermissionApi.mutate({
      id: id,
      payload: {
        isActive: !isActive,
      },
    })
  }

  //
  async function onSubmitKeyGroup(
    data: z.infer<typeof UpdatePermissionSchema>
  ) {
    try {
      await Promise.all(
        permission.map((perm) =>
          updatePermissionApi.mutateAsync({
            id: perm.id,
            payload: {
              keyGroup: data.keyGroup,
            },
          })
        )
      )
      setOpenInputKeyGroup(false)
    } catch (error) {
      console.error("Failed to update permissions:", error)
    }
  }

  return (
    <Card className="@container/card" key={keyGroup}>
      <CardHeader>
        <CardDescription>
          <Badge variant="outline">{permission.length} permissions</Badge>
        </CardDescription>
        <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {openInputKeyGroup ? (
            <form onSubmit={form.handleSubmit(onSubmitKeyGroup)} ref={formRef}>
              <FieldGroup>
                <Controller
                  name="keyGroup"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        {...field}
                        type="text"
                        autoFocus
                        aria-invalid={fieldState.invalid}
                        placeholder="Key Group"
                        autoComplete="keyGroup"
                        id="form-rhf-input-keyGroup"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <p onDoubleClick={() => setOpenInputKeyGroup(true)}>
                  {keyGroup}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Double-click to edit</p>
              </TooltipContent>
            </Tooltip>
          )}
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
                <span
                  className="cursor-pointer"
                  onClick={() => togglePermissionStatus(perm.id, perm.isActive)}
                >
                  <Active isActive={perm.isActive} />
                </span>
              </div>
            ))}
          </>
        ) : (
          <p>No permissions found</p>
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
