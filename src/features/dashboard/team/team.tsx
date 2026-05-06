"use client"

import { useState } from "react"
import { StoreSelect } from "./store-select"
import { TeamTree } from "./team-tree"
import { useFindAllTeams } from "@/hooks/use-team"

export function TeamPage() {
  const [selectedStore, setSelectedStore] = useState("company-root")
  const [storeLabel, setStoreLabel] = useState("Tổng công ty")

  const { data, isLoading } = useFindAllTeams({
    page: 1,
    limit: 100,
    filters: {
      // Nếu là root thì không gửi storeId để lấy global teams
      store: selectedStore === "company-root" ? "" : selectedStore,
    },
  })

  const teams = data?.metadata || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sơ đồ tổ chức</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý cấu trúc nhân sự và đội ngũ
          </p>
        </div>
        <div className="w-[300px]">
          <StoreSelect
            value={selectedStore}
            onValueChange={setSelectedStore}
            onLabelChange={setStoreLabel}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          Đang tải dữ liệu...
        </div>
      ) : (
        <TeamTree
          treeData={teams}
          rootName={storeLabel}
          storeId={selectedStore}
        />
      )}
    </div>
  )
}
