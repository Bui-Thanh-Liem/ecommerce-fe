"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlusIcon,
} from "lucide-react"
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
import { Label } from "./ui/label"
import { useUrlParams } from "@/hooks/use-url-params"
import { useMemo } from "react"
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface DataCardProps<T extends IBase> {
  tabHeader?: string
  onAddCard?: () => void
  tabContent?: React.ReactNode
  dataSource: ResMetadataDto<T>
  renderCard: (item: T) => React.ReactNode
  onPaginationChange?: (pagination: PaginationState) => void
}

export function DataCard<T extends IBase>({
  tabHeader,
  onAddCard,
  dataSource,
  tabContent,
  renderCard, // Nhận renderCard từ props
  onPaginationChange,
}: DataCardProps<T>) {
  const { data: cardData, totalData, totalPage } = dataSource

  // Đồng bộ pagination state nội bộ dựa trên dữ liệu API truyền xuống ban đầu
  const { params: urlParams, setParams: setUrlParams } = useUrlParams({
    page: 1,
    limit: 10,
  })

  // Định nghĩa state pagination để truyền vào React Table (Sync từ URL xuống)
  const pagination = useMemo(
    () => ({
      pageIndex: urlParams.page - 1, // URL bắt đầu từ 1, Tanstack Table từ 0
      pageSize: urlParams.limit,
    }),
    [urlParams.page, urlParams.limit]
  )

  //
  const table = useReactTable({
    data: cardData,
    columns: [],
    state: {
      pagination,
    },
    // Server-side pagination config quan trọng:
    manualPagination: true,
    pageCount: totalPage ?? -1,

    enableRowSelection: true,
    getRowId: (row) => row.id.toString(),
    onPaginationChange: (updater) => {
      const nextPagination =
        typeof updater === "function" ? updater(pagination) : updater

      // Đẩy ngược value lên URL (Nó sẽ tự gỡ param xuống nếu rơi vào điều kiện mặc định)
      setUrlParams({
        page: nextPagination.pageIndex + 1,
        limit: nextPagination.pageSize,
      })

      // Đồng thời kích hoạt callback báo cho cha biết (nếu có)
      onPaginationChange?.(nextPagination)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

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
      <TabsContent value="card" className="mt-0 flex flex-col gap-4">
        {cardData.length === 0 ? (
          <Nothing />
        ) : (
          <>
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid max-h-[calc(100vh-220px)] grid-cols-1 gap-4 overflow-y-auto p-1 *:data-[slot=card]:shadow-sm @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {cardData.map((item) => (
                <div key={item.id}>
                  {/* Gọi hàm renderCard và truyền dữ liệu vào */}
                  {renderCard(item)}
                </div>
              ))}
            </div>
            {/* ----------------- PHẦN PAGINATION ĐÃ HOÀN THIỆN LOGIC ----------------- */}
            <div className="flex w-full justify-end">
              <div className="flex w-full items-center gap-8 lg:w-fit">
                {/* Hàng trên mỗi trang (Rows per page) */}
                <div className="hidden items-center gap-2 lg:flex">
                  <Label
                    htmlFor="rows-per-page"
                    className="text-sm font-medium"
                  >
                    Rows per page
                  </Label>
                  <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-20"
                      id="rows-per-page"
                    >
                      <SelectValue placeholder={pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      <SelectGroup>
                        {[10, 20, 30, 50, 100].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hiển thị số trang hiện tại */}
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                  Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </div>

                {/* Bộ điều hướng trang (Các nút bấm) */}
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeftIcon />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRightIcon />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    size="icon"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRightIcon />
                  </Button>
                </div>
              </div>
            </div>
            {/* ----------------------------------------------------------------------- */}
          </>
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
