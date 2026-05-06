"use client"
import { Active } from "@/components/active"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFindAllPermissions } from "@/hooks/use-permission"
import { useFindAllRoles, useUpdateRole } from "@/hooks/use-role"
import { cn } from "@/lib/utils"
import { UpdateRoleSchema } from "@/shared/dtos/req/role.dto"
import { IPermission } from "@/shared/interfaces/models/permission.interface"
import { IRole } from "@/shared/interfaces/models/role.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { Minus, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { groupByKeyGroup } from "../permission/permission"
import { RoleAdd } from "./role-add"

function PermissionItem({
  permission,
  onDeletePermission,
}: {
  permission: IPermission
  onDeletePermission: (permissionId: string) => void
}) {
  return (
    <div
      key={permission.id}
      className="group relative flex items-center justify-between overflow-hidden rounded-md p-2 transition-colors hover:bg-gray-50"
    >
      {/* Nội dung bên trái */}
      <span className="relative z-10 text-sm transition-colors group-hover:text-red-700">
        {permission.code} - {permission.desc}
      </span>

      {/* Cụm điều khiển bên phải */}
      <div className="relative z-10 flex items-center gap-x-2">
        {/* Icon Minus trôi từ phải sang */}
        <span
          onClick={() => onDeletePermission(permission.id)}
          className="translate-x-4 cursor-pointer text-red-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        >
          <Minus size={16} />
        </span>

        {/* Trạng thái Active */}
        <Active isActive={permission.isActive} />
      </div>

      {/* Lớp nền nếu bạn muốn nó đổi màu cả dòng khi hover (Optional) */}
      <span className="absolute inset-0 bg-red-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
    </div>
  )
}

function ActionPermissionToRole({
  roleId,
  holdPermissions,
}: {
  roleId: string
  holdPermissions: IPermission[]
}) {
  //
  const { data } = useFindAllPermissions()
  const permissions = data?.metadata || []
  const groupedPermissions = groupByKeyGroup(permissions)

  //
  const updateRoleApi = useUpdateRole()

  //
  const [open, setOpen] = useState(false)

  //
  const form = useForm<z.infer<typeof UpdateRoleSchema>>({
    resolver: zodResolver(UpdateRoleSchema),
    defaultValues: {
      permissions: holdPermissions.map((perm) => perm.id),
    },
  })
  const permissionErrors = form.formState.errors.permissions

  //
  useEffect(() => {
    form.reset({
      permissions: holdPermissions.map((perm) => perm.id),
    })
  }, [holdPermissions, form])

  //
  async function onSubmit(data: z.infer<typeof UpdateRoleSchema>) {
    try {
      const res = await updateRoleApi.mutateAsync({
        id: roleId,
        payload: {
          permissions: data.permissions,
        },
      })
      if (res?.statusCode === 200) {
        setOpen(false)
        form.reset()
      }
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto" size="sm" variant="outline">
          Action permission <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Action Permission</DialogTitle>
          <DialogDescription>
            Add or remove permissions for this role. Please make sure to save
            changes after updating the permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FieldLabel
              className={cn("mb-2", permissionErrors && "text-destructive")}
            >
              Permissions
            </FieldLabel>
            <div className="max-h-[calc(100vh-300px)] space-y-4 overflow-y-auto">
              {Object.entries(groupedPermissions).map(([keyGroup, perms]) => (
                <div key={keyGroup} className="border-b p-2 last:border-0">
                  <p className="bg-muted mb-2 rounded-sm px-2 py-1 text-sm font-medium">
                    {keyGroup}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-center space-x-2"
                      >
                        <Controller
                          name="permissions"
                          control={form.control}
                          render={({ field }) => {
                            const value = field.value ?? []
                            const isChecked = value.includes(perm.id)

                            return (
                              <Switch
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...value, perm.id])
                                  } else {
                                    field.onChange(
                                      value.filter((id) => id !== perm.id)
                                    )
                                  }
                                }}
                              />
                            )
                          }}
                        />
                        <span className="text-sm">
                          {perm.code} - {perm.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {permissionErrors && (
              <p className="text-destructive mt-2 text-sm font-medium">
                {permissionErrors.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {updateRoleApi.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RoleCard({ role }: { role: IRole }) {
  const groupedPermissions = groupByKeyGroup(role.permissions)
  const store = role?.store

  const [openInputName, setOpenInputName] = useState(false)

  // 1. Tạo ref
  const formRef = useRef<HTMLFormElement>(null)

  // 2. Logic xử lý click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpenInputName(false)
      }
    }

    if (openInputName) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openInputName])

  // API
  const updateRoleApi = useUpdateRole()

  //
  const form = useForm<z.infer<typeof UpdateRoleSchema>>({
    resolver: zodResolver(UpdateRoleSchema),
    defaultValues: {
      name: role.name,
    },
  })

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

  //
  async function onSubmitName(data: z.infer<typeof UpdateRoleSchema>) {
    try {
      await updateRoleApi.mutateAsync({
        id: role.id,
        payload: {
          name: data.name,
        },
      })
      setOpenInputName(false)
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  // Xử lý xóa permission khỏi role
  async function handleDeletePermission(permissionId: string) {
    if (role.permissions.length === 1) {
      toast.warning(
        "A role must have at least one permission. Please add another permission before deleting this one."
      )
    }

    try {
      const updatedPermissions = role.permissions
        .filter((perm) => perm.id !== permissionId)
        .map((perm) => perm.id)
      await updateRoleApi.mutateAsync({
        id: role.id,
        payload: {
          permissions: updatedPermissions,
        },
      })
    } catch (error) {
      console.error("Failed to delete permission from role:", error)
    }
  }

  //
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
          {openInputName ? (
            <form onSubmit={form.handleSubmit(onSubmitName)} ref={formRef}>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        {...field}
                        type="text"
                        autoFocus
                        aria-invalid={fieldState.invalid}
                        placeholder="Role Name"
                        autoComplete="name"
                        id="form-rhf-input-name"
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
                <p onDoubleClick={() => setOpenInputName(true)}>{role.name}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Double-click to edit</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">{role.desc}</CardDescription>
        <CardAction>
          <span
            className="cursor-pointer"
            onClick={() => toggleRoleStatus(role.id, role.isActive)}
          >
            <Active isActive={role.isActive} />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-440px)] flex-col items-start gap-1.5 overflow-y-auto text-sm">
        {Object.entries(groupedPermissions).map(([keyGroup, perms]) => (
          <div key={keyGroup} className="w-full">
            <p className="bg-muted mb-2 rounded-sm px-2 py-1 text-sm font-medium">
              {keyGroup}
            </p>
            {perms.map((perm) => (
              <PermissionItem
                permission={perm}
                key={perm.id}
                onDeletePermission={handleDeletePermission}
              />
            ))}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <ActionPermissionToRole
          roleId={role.id}
          holdPermissions={role.permissions}
        />
      </CardFooter>
    </Card>
  )
}

export function RolePage() {
  const { data } = useFindAllRoles()
  const roles = data?.metadata || []

  return (
    <div className="space-y-6">
      <RoleAdd />
      <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-1 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {roles.map((role) => (
          <RoleCard role={role} key={role.id} />
        ))}
      </div>
    </div>
  )
}
