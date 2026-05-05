"use client"
import { useFindTreeDataByRootId } from "@/hooks/use-location-region"
import { LocationRegionTree } from "./location-region-tree"

export function LocationRegionPage() {
  const { data } = useFindTreeDataByRootId("")
  const treeData = data?.metadata || []
  return <LocationRegionTree treeData={treeData} />
}
