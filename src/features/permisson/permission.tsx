"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFindAllPermissions } from "@/hooks/use-permission";

export function PermissionPage() {

  const { data } = useFindAllPermissions();
  const permissions = data?.metadata || [];
  const groupedPermissions = permissions.reduce((groups: Record<string, typeof permissions>, permission) => {
    const keyGroup = permission.keyGroup || 'Khác';
    if (!groups[keyGroup]) {
      groups[keyGroup] = [];
    }
    groups[keyGroup].push(permission);
    return groups;
  }, {});

  return <div>
    {Object.entries(groupedPermissions).map(([keyGroup, perms]) => (
      <Card key={keyGroup} className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">{keyGroup}</h2>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {perms.map((perm) => (
              <li key={perm.id}>  
                <span className="font-medium">{perm.name}</span>: {perm.desc}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    ))}
  </div>
}