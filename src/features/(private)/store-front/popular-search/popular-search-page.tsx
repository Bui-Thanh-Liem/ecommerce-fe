"use client"

import { useState } from "react"
import {
  useDeletePopularSearch,
  useFindAllPopularSearches,
} from "@/hooks/apis/store-front/use-popular-search"
import { IPopularSearch } from "@/shared/interfaces/models/store-front/popular-search.interface"
import { PopularSearchAction } from "./popular-search-action"
import { DataCard } from "@/components/data-card"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Edit2,
  Loader2,
  RotateCcw,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import { useUrlParams } from "@/hooks/use-url-params"

function PopularSearchCard({
  popularSearch,
  onEdit,
  onDelete,
  isPending,
}: {
  popularSearch: IPopularSearch
  isPending?: boolean
  onEdit?: (popularSearch: IPopularSearch) => void
  onDelete?: (popularSearch: IPopularSearch) => void
}) {
  return (
    <Card className="group border border-slate-200 bg-white py-2 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <CardContent className="flex items-center justify-between px-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-4 w-4 text-slate-500" />
          </div>

          <p className="truncate text-sm font-medium text-slate-700">
            {popularSearch.text || "Create a new search"}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => onEdit?.(popularSearch)}
            disabled={isPending}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete?.(popularSearch)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PopularSearchPage() {
  const { params, setParams } = useUrlParams({ page: 1, limit: 50 })

  const { mutateAsync, isPending } = useDeletePopularSearch()
  const { data } = useFindAllPopularSearches(params)
  const metadataPopularSearches = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IPopularSearch | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDelete(row: IPopularSearch) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  if (!metadataPopularSearches) return null

  return (
    <>
      <Card className="border-l-4 border-l-amber-500 bg-linear-to-r from-amber-50 to-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <TriangleAlert className="h-5 w-5 text-amber-500" />
            Manual Popular Searches
          </CardTitle>

          <CardDescription className="space-y-2 text-sm leading-relaxed text-slate-600">
            <p>
              Popular keyword lists are often automatically generated based on
              actual user search data.
            </p>

            <p className="font-medium text-amber-700">
              This is a marketing support feature that allows you to add or
              modify popular keywords without waiting for users to perform
              searches.
            </p>

            <p>
              If you want to sync the data from the most recent user searches,
              please click the <strong>Load</strong> button to fetch and update
              the list of popular keywords.
            </p>
          </CardDescription>

          <CardAction>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-300 bg-white hover:bg-amber-100"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Load
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      <DataCard
        dataSource={metadataPopularSearches}
        renderCard={(popularSearch) => (
          <PopularSearchCard
            popularSearch={popularSearch}
            onEdit={(popularSearch) => {
              setOpen(true)
              setDataEdit(popularSearch)
            }}
            onDelete={(popularSearch) => {
              handleDelete(popularSearch)
            }}
            isPending={isPending}
          />
        )}
        onAddCard={() => {
          setOpen(true)
        }}
        className="@xl/main:grid-cols-5 @5xl/main:grid-cols-5"
      />

      <PopularSearchAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
      />
    </>
  )
}
