"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Nothing } from "@/components/no-thing"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IBase } from "@/shared/interfaces/common/base.interface"

interface DataCardProps<T extends IBase> {
  tabHeader?: string
  onAddCard?: () => void
  tabContent?: React.ReactNode
  dataSource: ResMetadataDto<T>
  renderCard: (item: T) => React.ReactNode
}

export function DataCard<T extends IBase>({
  tabHeader,
  onAddCard,
  dataSource,
  tabContent,
  renderCard, // Nhận renderCard từ props
}: DataCardProps<T>) {
  const { data: cardData, totalData } = dataSource

  return (
    <Tabs defaultValue="card" className="w-full">
      <div className="mb-4 flex items-center justify-between">
        {/* Mobile View Selector */}
        <Select defaultValue="card">
          <SelectTrigger
            size="sm"
            id="view-selector"
            className="flex w-fit @4xl/main:hidden"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="card">
                Card{" "}
                <Badge variant="secondary" className="ml-2">
                  {totalData}
                </Badge>
              </SelectItem>
              {tabHeader && (
                <SelectItem value={tabHeader}>
                  {tabHeader}{" "}
                  <Badge variant="secondary" className="ml-2">
                    {totalData}
                  </Badge>
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Desktop Tabs */}
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="card">
            Card{" "}
            <Badge variant="secondary" className="ml-2">
              {totalData}
            </Badge>
          </TabsTrigger>
          {tabHeader && (
            <TabsTrigger value={tabHeader}>
              {tabHeader}
              <Badge variant="secondary" className="ml-2">
                {totalData}
              </Badge>
            </TabsTrigger>
          )}
        </TabsList>

        <Button size="sm" onClick={onAddCard}>
          <PlusIcon className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Add item</span>
        </Button>
      </div>

      {/* Giao diện Card */}
      <TabsContent value="card" className="mt-0">
        {cardData.length === 0 ? (
          <Nothing />
        ) : (
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid max-h-[calc(100vh-180px)] grid-cols-1 gap-4 overflow-y-auto p-1 *:data-[slot=card]:shadow-sm @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {cardData.map((item) => (
              <div key={item.id}>
                {/* Gọi hàm renderCard và truyền dữ liệu vào */}
                {renderCard(item)}
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/*  */}
      {tabHeader && (
        <TabsContent value={tabHeader} className="mt-0">
          {tabContent}
        </TabsContent>
      )}
    </Tabs>
  )
}
