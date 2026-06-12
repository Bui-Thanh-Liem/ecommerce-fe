"use client"

import React, { useMemo, useState, useCallback, useRef } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  BackgroundVariant,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  ShieldAlert,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Crown,
  UserPlus,
  Pencil,
  Trash2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getLayoutElements } from "@/utils/diagram.util"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IStaff } from "@/shared/interfaces/models/management/staff.interface"

interface StaffHierarchyProps {
  dataSource: ResMetadataDto<IStaff>
  onCreate?: (staff: IStaff) => void
  onEdit?: (staff: IStaff) => void
  onDelete?: (staff: IStaff) => void
}

// --- CONTEXT MENU ---
const ContextMenu = ({ top, left, data, onClick, onClose }: any) => {
  return (
    <div
      style={{ top, left }}
      className="absolute z-100 min-w-52 rounded-xl border border-slate-200 bg-white/95 py-2 shadow-2xl backdrop-blur-md"
      onMouseLeave={onClose}
    >
      <div className="mb-1 border-b border-slate-100 px-4 py-1.5 text-[10px] font-bold tracking-tight text-slate-400 uppercase">
        Staff: {data.fullName}
      </div>
      <button
        onClick={() => onClick("create", data)}
        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
      >
        <UserPlus size={16} className="mr-3" /> Add Staff
      </button>
      <button
        onClick={() => onClick("edit", data)}
        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
      >
        <Pencil size={16} className="mr-3" /> Edit Staff
      </button>
      <button
        onClick={() => onClick("delete", data)}
        className="mt-1 flex w-full items-center border-t border-slate-50 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 size={16} className="mr-3" /> Delete Staff
      </button>
    </div>
  )
}

// --- CUSTOM STAFF NODE ---
const StaffNode = ({ data }: { data: IStaff }) => {
  const getRoleConfig = () => {
    if (data.isSuperAdmin)
      return {
        icon: <Crown size={18} />,
        color: "border-orange-500",
        label: "Super Admin",
        text: "text-orange-700",
      }
    if (data.isSubAdmin)
      return {
        icon: <ShieldAlert size={18} />,
        color: "border-yellow-500",
        label: "Sub Admin",
        text: "text-yellow-700",
      }
    if (data.isStoreAdmin)
      return {
        icon: <ShieldCheck size={18} />,
        color: "border-emerald-500",
        label: "Store Admin",
        text: "text-emerald-700",
      }
    return {
      icon: <User size={18} />,
      color: "border-slate-500",
      label: "Staff",
      text: "text-slate-700",
    }
  }
  const config = getRoleConfig()

  return (
    <div
      className={`min-w-65 rounded-2xl border-2 bg-white p-4 shadow-sm ${config.color}`}
    >
      {!data.isSuperAdmin && (
        <Handle
          type="target"
          position={Position.Top}
          className="bg-slate-300!"
        />
      )}

      <div className="mb-2 flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase ${config.text}`}>
          {config.label}
        </span>
        <div className={config.text}>{config.icon}</div>
      </div>

      <div className="flex items-center gap-x-4">
        <Avatar className="h-10 w-10 rounded-lg">
          <AvatarImage src={data?.avatar?.url} alt={data?.fullName} />
          <AvatarFallback className="bg-slate-100 font-bold">
            {data?.fullName?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="truncate text-sm font-bold text-slate-800">
            {data?.fullName}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Mail size={10} className="shrink-0" />
            <span className="truncate">{data?.email}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-slate-400">
        <Phone size={10} />
        {data?.phone || "N/A"}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-slate-400!"
      />
    </div>
  )
}

const nodeTypes = { staffNode: StaffNode }

// --- MAIN COMPONENT ---
export function StaffHierarchy({
  dataSource,
  onEdit,
  onCreate,
  onDelete,
}: StaffHierarchyProps) {
  const { data: staffs } = dataSource

  const [menu, setMenu] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { nodes, edges } = useMemo(() => {
    const rawNodes = staffs.map((staff) => ({
      id: staff.id,
      type: "staffNode",
      data: { ...staff },
      position: { x: 0, y: 0 },
    }))

    const rawEdges: any[] = []
    staffs.forEach((staff) => {
      if (staff.directManager?.id) {
        rawEdges.push({
          id: `e-${staff.directManager.id}-${staff.id}`,
          source: staff.directManager.id,
          target: staff.id,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#94a3b8", strokeWidth: 2 },
        })
      }
    })

    return getLayoutElements(rawNodes, rawEdges)
  }, [staffs])

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault()
      const pane = containerRef.current?.getBoundingClientRect()
      if (!pane) return

      setMenu({
        data: node.data,
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
      })
    },
    []
  )

  const handleAction = (action: string, data: IStaff) => {
    setMenu(null)
    if (action === "create") onCreate?.(data)
    if (action === "edit") onEdit?.(data)
    if (action === "delete") onDelete?.(data)
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-180px)] w-full overflow-hidden rounded-2xl border bg-slate-50/50 shadow-inner"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={() => setMenu(null)}
        fitView
        nodesConnectable={false}
      >
        <Background variant={BackgroundVariant.Lines} color="#f1f5f9" />

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
          <h3 className="text-sm font-bold text-slate-800">
            Phân cấp nhân viên
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Chuột phải vào từng thẻ để quản lý
          </p>
        </Panel>

        {menu && (
          <ContextMenu
            onClick={handleAction}
            onClose={() => setMenu(null)}
            {...menu}
          />
        )}
      </ReactFlow>
    </div>
  )
}
