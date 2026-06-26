"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeContent } from "./tab-content/home/home-content"
import { useFindStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"

export function StoreFrontPage() {
  const { data, isLoading, isFetching } = useFindStoreFrontConfig()
  const storeFrontConfig = data?.metadata || null

  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="product-of-category">
          Products of category
        </TabsTrigger>
        <TabsTrigger value="campaign">Campaign</TabsTrigger>
      </TabsList>

      {/*  */}
      <TabsContent value="home">
        <HomeContent
          storeFrontConfig={storeFrontConfig}
          isLoading={isLoading || isFetching}
        />
      </TabsContent>

      {/*  */}
      <TabsContent value="product-of-category">
        <Card>
          <CardHeader>
            <CardTitle>Product of Category</CardTitle>
            <CardDescription>
              View products within each category. Manage inventory and pricing.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 50 products across 10 categories.
          </CardContent>
        </Card>
      </TabsContent>

      {/*  */}
      <TabsContent value="product-of-category">
        <Card>
          <CardHeader>
            <CardTitle>Campaign</CardTitle>
            <CardDescription>
              View products within each category. Manage inventory and pricing.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 50 products across 10 categories.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
