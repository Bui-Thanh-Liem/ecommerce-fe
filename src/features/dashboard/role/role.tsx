"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
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
import { Textarea } from "@/components/ui/textarea"
import { useFindAllPermissions } from "@/hooks/use-permission"
import { useCreateRole, useFindAllRoles } from "@/hooks/use-role"
import { CreateRoleSchema } from "@/shared/dtos/req/create-role.dto"
import { IRole } from "@/shared/interfaces/models/role.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleCheckIcon, LoaderIcon, Plus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { groupByKeyGroup } from "../permisson/permission"
import { cn } from "@/lib/utils"

function RoleCard({ role }: { role: IRole }) {
  const groupedPermissions = groupByKeyGroup(role.permissions)

  return (
    <Card className="@container/card" key={role.id}>
      <CardHeader>
        <CardDescription>
          <Badge variant="outline">{role.permissions.length} permissions</Badge>
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

function AddCard() {
  const { data } = useFindAllPermissions()
  const permissions = data?.metadata || []
  const groupedPermissions = groupByKeyGroup(permissions)
  const createRoleApi = useCreateRole()

  const form = useForm<z.infer<typeof CreateRoleSchema>>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: "",
      desc: "",
      permissions: [],
      isActive: true,
    },
  })
  const permissionErrors = form.formState.errors.permissions

  async function onSubmit(data: z.infer<typeof CreateRoleSchema>) {
    const res = await createRoleApi.mutateAsync(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="@container/card border-2 border-dashed">
          <CardContent className="flex h-full cursor-pointer items-center justify-center">
            <Button variant="outline">
              <Plus />
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Role</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="mb-4">
            <Controller
              name="isActive"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-isActive">Active</FieldLabel>
                  <Switch
                    id="form-isActive"
                    checked={field.value} // RHF lưu giá trị boolean
                    onCheckedChange={field.onChange} // Cập nhật lại giá trị vào RHF
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-x-4">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-name">Name</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="name"
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

            <FieldGroup>
              <Controller
                name="desc"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-desc">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      rows={2}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter description here..."
                      id="form-rhf-textarea-desc"
                      className="resize-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <div className="mb-4">
            <FieldLabel
              className={cn("mb-2", permissionErrors && "text-destructive")}
            >
              Permissions
            </FieldLabel>
            <div className="max-h-96 space-y-4 overflow-y-auto rounded-md border">
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
                            const isChecked = field.value.includes(perm.id)

                            return (
                              <Switch
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, perm.id])
                                  } else {
                                    field.onChange(
                                      field.value.filter((id) => id !== perm.id)
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
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
