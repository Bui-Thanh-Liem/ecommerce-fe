"use client"

import { useState } from "react"
import { StoreSelect } from "./store-select"
import { TeamTree } from "./team-tree"
import { useFindAllTeams } from "@/hooks/use-team"

export function TeamPage() {
  const [selectedStore, setSelectedStore] = useState("company-root")
  const [storeLabel, setStoreLabel] = useState("Công ty (Tổng)")

  // Lấy dữ liệu team dựa trên storeId
  // Nếu là company-root, chúng ta gửi rỗng để lấy các team thuộc công ty
  const { data } = useFindAllTeams({
    storeId: selectedStore === "company-root" ? "" : selectedStore,
  })

  const treeData = data?.metadata || []

  return (
    <div className="space-y-6">
      <StoreSelect
        value={selectedStore}
        onValueChange={setSelectedStore}
        onLabelChange={setStoreLabel}
      />

      <TeamTree
        treeData={treeData}
        rootName={storeLabel}
        storeId={selectedStore}
      />
    </div>
  )
}
