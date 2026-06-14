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
  LayoutGrid,
  Plus,
  Pencil,
  Trash2,
  Tag,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { useFindTreeDataCategories } from "@/hooks/apis/catalog/use-category"
import { getLayoutElements } from "@/utils/diagram.util"
import { ICategory } from "@/shared/interfaces/models/catalog/category.interface"
import Image from "next/image"

// --- STYLES & CONFIG ---
const nodeColorGradient = "from-[#0ea5e9] to-[#2563eb]" // Blue Sky to Royal Blue

// --- CONTEXT MENU (Glassmorphism style) ---
const ContextMenu = ({ id, top, left, data, onClick, onClose }: any) => {
  return (
    <div
      style={{ top: `${top}px`, left: `${left}px` }}
      className="animate-in fade-in zoom-in absolute z-100 min-w-45 overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md duration-200"
      onMouseLeave={onClose}
    >
      <div className="border-b border-slate-100 bg-slate-50/50 px-3 py-2">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Thao tác
        </p>
      </div>
      <div className="p-1">
        <button
          onClick={() => onClick("create", data)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-all hover:bg-blue-500 hover:text-white"
        >
          <Plus size={14} /> Thêm cấp con
        </button>
        <button
          onClick={() => onClick("edit", data)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-all hover:bg-slate-100"
        >
          <Pencil size={14} /> Chỉnh sửa
        </button>
        <div className="my-1 border-t border-slate-100" />
        <button
          onClick={() => onClick("delete", data)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-all hover:bg-red-50"
        >
          <Trash2 size={14} /> Xóa danh mục
        </button>
      </div>
    </div>
  )
}

// --- CUSTOM CATEGORY NODE (Modern Card style) ---
const CategoryNode = ({ data }: { data: ICategory }) => {
  const isRoot = !data.parent
  const imageElement = data.image ? (
    <div className="relative h-full w-full">
      <Image src={data.image.url} alt={data.name} fill />
    </div>
  ) : isRoot ? (
    <LayoutGrid size={22} className="text-white" />
  ) : (
    <Tag size={20} className="text-slate-400" />
  )

  return (
    <div className={`group relative min-w-60 transition-all duration-300`}>
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-20" />

      <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all group-hover:border-blue-400 group-hover:shadow-md">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg shadow-blue-200 ${
            isRoot ? `bg-linear-to-br ${nodeColorGradient}` : "bg-slate-200"
          }`}
        >
          {imageElement}
        </div>

        <div className="ml-4 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold text-slate-900">
              {data.name}
            </span>
            {isRoot && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                ROOT
              </span>
            )}
          </div>
          <div className="flex items-center text-[11px] font-medium text-slate-400">
            <span className="mr-1 font-mono tracking-tighter text-blue-400 uppercase italic">
              {data.code}
            </span>
            <ChevronRight size={10} className="mx-1" />
            <span className="max-w-25 truncate">{data.slug}</span>
          </div>
        </div>

        <div className="ml-2 self-start opacity-0 transition-opacity group-hover:opacity-100">
          <MoreHorizontal size={16} className="text-slate-400" />
        </div>
      </div>

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
  )
}

const nodeTypes = { category: CategoryNode }

interface CategoryHierarchyProps {
  onEdit?: (data: ICategory) => void
  onDelete?: (data: ICategory) => void
  onCreate?: (data: ICategory) => void
}

export function CategoryHierarchy({
  onCreate,
  onEdit,
  onDelete,
}: CategoryHierarchyProps) {
  const { data } = useFindTreeDataCategories({ filters: { parent: "" } })
  const treeData = useMemo(() => data?.metadata || [], [data])
  const containerRef = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<any>(null)

  const { nodes, edges } = useMemo(() => {
    const rawNodes: any[] = []
    const rawEdges: any[] = []

    const traverse = (items: any[], parentId: string | null = null) => {
      items.forEach((item) => {
        rawNodes.push({
          id: item.id,
          type: "category",
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
            interactionWidth: 0,
            style: { stroke: "#3b82f6", strokeWidth: 1.5, opacity: 0.4 },
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
      className="relative h-[calc(100vh-180px)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc]"
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
        <Background gap={28} size={1} color="#cbd5e1" variant={undefined} />

        {/* Customized Controls */}
        <Panel
          position="bottom-right"
          className="flex gap-2 rounded-lg border border-slate-200 bg-white/80 p-1.5 shadow-lg backdrop-blur-sm"
        >
          <Controls
            showInteractive={false}
            className="!static !m-0 !border-none !shadow-none"
          />
        </Panel>

        {/* Legend Panel */}
        <Panel
          position="top-left"
          className="m-4 flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
        >
          <h3 className="text-sm font-bold text-slate-800">
            Phân cấp danh mục
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Chuột phải vào từng thẻ để quản lý
          </p>
        </Panel>

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

  function handleMenuAction(action: string, categoryData: any) {
    setMenu(null)

    //
    const formattedData = {
      ...categoryData,
      parent: categoryData.parent ? { id: categoryData.parent } : undefined,
    }

    if (action === "create") onCreate?.(formattedData)
    if (action === "edit") onEdit?.(formattedData)
    if (action === "delete") onDelete?.(formattedData)
  }
}
