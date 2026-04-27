"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFindAllPermissions } from "@/hooks/use-permission";

export function PermissionPage() {

  const { data } = useFindAllPermissions();
  console.log("data :::", data);
  
  return <div>
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        Permission Page
      </CardContent>
    </Card>
  </div>
}