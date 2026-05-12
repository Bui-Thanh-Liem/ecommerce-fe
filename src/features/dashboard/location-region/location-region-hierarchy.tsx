"use client"

import React, { useMemo, useState, useCallback, useRef } from "react"
import {
  Background,
  Controls,
  ReactFlow,
  Handle,
  Position,
  ConnectionLineType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { MapPin, Map, Plus, Pencil, Trash2, Earth } from "lucide-react"
import { useFindTreeData } from "@/hooks/use-location-region"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"
import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import { getLayoutElements } from "@/utils/diagram.util"

interface LRHierarchyProps {
  onCreate?: (locationRegion: ILocationRegion) => void
  onEdit?: (locationRegion: ILocationRegion) => void
  onDelete?: (locationRegion: ILocationRegion) => void
}

// --- CONTEXT MENU ---
const ContextMenu = ({
  id,
  name,
  type,
  parent,
  top,
  left,
  onClick,
  onClose,
}: any) => {
  return (
    <div
      style={{ top: `${top}px`, left: `${left}px` }}
      className="absolute z-[100] min-w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/50"
      onMouseLeave={onClose}
    >
      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase">
        Tùy chọn khu vực
      </div>
      {type !== LocationRegionType.WARD_COMMUNE && (
        <button
          onClick={() => onClick("create", { id, name, type, parent })}
          className="flex w-full items-center px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#0979B1]"
        >
          <Plus size={14} className="mr-2" /> Thêm cấp con
        </button>
      )}
      <button
        onClick={() => onClick("edit", { id, name, type, parent })}
        className="flex w-full items-center px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
      >
        <Pencil size={14} className="mr-2" /> Chỉnh sửa
      </button>
      <hr className="my-1 border-slate-100" />
      <button
        onClick={() => onClick("delete", { id, name, type, parent })}
        className="flex w-full items-center px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 size={14} className="mr-2" /> Xóa khu vực
      </button>
    </div>
  )
}

// --- CUSTOM LOCATION NODE ---
const LocationNode = ({ data }: { data: ILocationRegion }) => {
  const isWorld = data.type === LocationRegionType.ROOT
  const isCountry = data.type === LocationRegionType.COUNTRY
  const isProvince = data.type === LocationRegionType.PROVINCE_CITY
  const isDistrict = data.type === LocationRegionType.DISTRICT_TOWN

  return (
    <div className="min-w-48 rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition-all hover:border-[#0979B1] hover:shadow-md">
      <div className="flex items-center">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-inner ${
            isWorld
              ? "bg-gradient-to-br from-green-400 to-green-600"
              : isCountry
                ? "bg-gradient-to-br from-blue-400 to-blue-600"
                : isProvince
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                  : isDistrict
                    ? "bg-gradient-to-br from-purple-400 to-purple-600"
                    : "bg-slate-400"
          }`}
        >
          {isWorld ? (
            <Earth size={16} />
          ) : isCountry ? (
            <MapPin size={16} />
          ) : isProvince ? (
            <Map size={16} />
          ) : (
            <MapPin size={16} />
          )}
        </div>
        <div className="ml-3 overflow-hidden">
          <div className="truncate text-sm font-bold text-slate-800">
            {data.name}
          </div>
          <div className="mt-0.5 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
            {data.type?.replace("_", " ")}
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-none !bg-slate-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-none !bg-slate-300"
      />
    </div>
  )
}

const nodeTypes = { location: LocationNode }

// --- MAIN COMPONENT ---
export function LocationRegionHierarchy({
  onCreate,
  onEdit,
  onDelete,
}: LRHierarchyProps) {
  const { data } = useFindTreeData({
    filters: {
      parent: "",
    },
  })
  const treeData = useMemo(() => data?.metadata || [], [data])

  const containerRef = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<any>(null)

  const { nodes, edges } = useMemo(() => {
    const rawNodes: any[] = []
    const rawEdges: any[] = []

    const traverse = (items: any[], parentId = null) => {
      items.forEach((item) => {
        rawNodes.push({
          id: item.id,
          name: item.name,
          type: "location",
          data: item,
          position: { x: 0, y: 0 }, // Sẽ được dagre tính toán lại
        })
        if (parentId) {
          rawEdges.push({
            id: `e${parentId}-${item.id}`,
            source: parentId,
            target: item.id,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#cbd5e1", strokeWidth: 2 },
          })
        }
        if (item.children?.length > 0) traverse(item.children, item.id)
      })
    }

    traverse(treeData)
    return getLayoutElements(rawNodes, rawEdges)
  }, [treeData])

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault()
      if (!containerRef.current) return
      const pane = containerRef.current.getBoundingClientRect()
      setMenu({
        id: node.id,
        name: node.name,
        type: node.data.type,
        parent: node.data.parent,
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
      })
    },
    []
  )

  const handleMenuAction = (action: string, data: ILocationRegion) => {
    setMenu(null)
    if (action === "create") onCreate?.({ parent: data } as ILocationRegion)
    if (action === "edit")
      onEdit?.({
        ...data,
        parent: { id: data.parent } as unknown as ILocationRegion,
      })
    if (action === "delete") onDelete?.(data)
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-180px)] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={() => setMenu(null)}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Background gap={24} size={1} color="#999" />
        <Controls showInteractive={false} className="bg-white shadow-sm" />
        {menu && (
          <ContextMenu
            onClick={handleMenuAction}
            onClose={() => setMenu(null)}
            {...menu}
          />
        )}
      </ReactFlow>
    </div>
  )
}
