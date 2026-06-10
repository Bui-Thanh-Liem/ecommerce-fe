"use client"

import React, { useMemo, useState, useCallback, useRef } from "react"
import {
  Background,
  Controls,
  ReactFlow,
  Handle,
  Position,
  ConnectionLineType,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  MapPin,
  Map,
  Plus,
  Pencil,
  Trash2,
  Earth,
  MoreHorizontal,
  Navigation2,
} from "lucide-react"
import { useFindTreeDataLocationRegions } from "@/hooks/apis/use-location-region"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"
import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import { getLayoutElements } from "@/utils/diagram.util"

// --- CONTEXT MENU (Modern Glassmorphism) ---
const ContextMenu = ({ id, type, data, top, left, onClick, onClose }: any) => {
  return (
    <div
      style={{ top: `${top}px`, left: `${left}px` }}
      className="animate-in fade-in zoom-in absolute z-100 min-w-45 overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md duration-200"
      onMouseLeave={onClose}
    >
      <div className="border-b border-slate-200/50 bg-slate-900/5 px-3 py-2">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Action
        </p>
      </div>
      <div className="p-1.5">
        {type !== LocationRegionType.WARD_COMMUNE && (
          <button
            onClick={() => onClick("create", data)}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-all hover:bg-blue-600 hover:text-white"
          >
            <Plus
              size={14}
              className="transition-transform group-hover:scale-110"
            />
            <span>Add Child</span>
          </button>
        )}
        <button
          onClick={() => onClick("edit", data)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-all hover:bg-slate-100"
        >
          <Pencil size={14} /> <span>Edit</span>
        </button>
        <div className="my-1 border-t border-slate-200/50" />
        <button
          onClick={() => onClick("delete", data)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-all hover:bg-red-50"
        >
          <Trash2 size={14} /> <span>Delete Region</span>
        </button>
      </div>
    </div>
  )
}

// --- CUSTOM LOCATION NODE (Sleek Card Design) ---
const LocationNode = ({ data }: { data: ILocationRegion }) => {
  const configs = {
    [LocationRegionType.ROOT]: {
      icon: Earth,
      color: "from-emerald-400 to-teal-600",
      label: "World",
    },
    [LocationRegionType.COUNTRY]: {
      icon: Navigation2,
      color: "from-blue-500 to-indigo-600",
      label: "Country",
    },
    [LocationRegionType.PROVINCE_CITY]: {
      icon: Map,
      color: "from-amber-400 to-orange-500",
      label: "Province / City",
    },
    [LocationRegionType.DISTRICT_TOWN]: {
      icon: MapPin,
      color: "from-purple-500 to-pink-600",
      label: "District / Town",
    },
    [LocationRegionType.WARD_COMMUNE]: {
      icon: MapPin,
      color: "from-slate-400 to-slate-600",
      label: "Ward / Commune",
    },
  }

  const config =
    configs[data.type as keyof typeof configs] ||
    configs[LocationRegionType.WARD_COMMUNE]
  const Icon = config.icon

  return (
    <div className="group relative transition-all duration-300">
      {/* Glow Effect on Hover */}
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-linear-to-r ${config.color} opacity-0 blur transition duration-300 group-hover:opacity-20`}
      />

      <div className="relative min-w-65 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all group-hover:border-blue-400 group-hover:shadow-md">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${config.color} text-white shadow-lg`}
          >
            <Icon size={22} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-[15px] leading-tight font-bold text-slate-800">
              {data.name}
            </span>
            <span className="mt-1 flex w-fit items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-500 uppercase">
              {config.label}
            </span>
          </div>

          <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
            <MoreHorizontal size={16} className="text-slate-400" />
          </div>
        </div>

        {/* Connection Points */}
        <Handle
          type="target"
          position={Position.Top}
          className="h-3! w-3! border-2! border-white! bg-blue-500!"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-3! w-3! border-2! border-white! bg-blue-500!"
        />
      </div>
    </div>
  )
}

const nodeTypes = { location: LocationNode }

interface LRHierarchyProps {
  onCreate?: (data: ILocationRegion) => void
  onEdit?: (data: ILocationRegion) => void
  onDelete?: (data: ILocationRegion) => void
}

export function LocationRegionHierarchy({
  onCreate,
  onEdit,
  onDelete,
}: LRHierarchyProps) {
  const { data } = useFindTreeDataLocationRegions({ filters: { parent: "" } })
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
          type: "location",
          data: item,
          position: { x: 0, y: 0 },
        })
        if (parentId) {
          rawEdges.push({
            id: `e${parentId}-${item.id}`,
            source: parentId,
            target: item.id,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#94a3b8", strokeWidth: 2, opacity: 0.6 },
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
        type: node.data.type,
        data: node.data,
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
      })
    },
    []
  )

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-180px)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC]"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={() => setMenu(null)}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{ animated: true }}
        fitView
      >
        <Background gap={28} size={1} color="#E2E8F0" />

        {/* Customized Controls */}
        <Panel
          position="bottom-right"
          className="flex gap-2 rounded-lg border border-slate-200 bg-white/80 p-1.5 shadow-lg backdrop-blur-sm"
        >
          <Controls
            showInteractive={false}
            className="static! m-0! border-none! shadow-none!"
          />
        </Panel>

        {/* Legend Panel */}
        <Panel
          position="top-left"
          className="m-4 flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
        >
          <h3 className="text-sm font-bold text-slate-800">Region Hierarchy</h3>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Right-click on each node to manage
          </p>
        </Panel>

        {menu && (
          <ContextMenu
            onClick={(action: string, catData: ILocationRegion) => {
              setMenu(null)
              if (action === "create")
                onCreate?.({ parent: catData } as ILocationRegion)
              if (action === "edit") onEdit?.(catData)
              if (action === "delete") onDelete?.(catData)
            }}
            onClose={() => setMenu(null)}
            {...menu}
          />
        )}
      </ReactFlow>
    </div>
  )
}
