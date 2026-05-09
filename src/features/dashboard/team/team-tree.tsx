"use client"

import React, { useMemo, useState, useCallback, useRef } from "react"
import {
  Background,
  Controls,
  ReactFlow,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import dagre from "dagre"
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Layers,
  ShieldCheck,
  Users,
  UserPlus,
} from "lucide-react"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { TeamAdd } from "./team-add"
import { getLayoutElements } from "@/utils/diagram.util"

// --- CUSTOM NODES ---
const RootNode = ({ data }: NodeProps) => (
  <div className="min-w-[260px] rounded-2xl border-2 border-blue-600 bg-blue-600 p-4 shadow-xl">
    <div className="flex items-center gap-3 text-white">
      <div className="rounded-lg bg-white/20 p-2">
        <Building2 size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase opacity-80">
          Hệ thống / Cửa hàng
        </p>
        <p className="text-lg leading-tight font-black">{data.name}</p>
      </div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="!h-3 !w-3 !bg-blue-400"
    />
  </div>
)

const TeamNode = ({ data }: NodeProps) => (
  <div className="group min-w-[220px] rounded-xl border-2 border-indigo-200 bg-white p-3 shadow-md transition-all hover:border-indigo-500">
    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
      <div className="flex items-center gap-2">
        <Layers size={18} className="text-indigo-500" />
        <span className="font-bold text-slate-700">{data.name}</span>
      </div>
      <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600">
        TEAM
      </span>
    </div>
    <div className="flex items-center gap-2 text-[11px] text-slate-500">
      <Users size={12} /> <span>{data.members?.length || 0} thành viên</span>
    </div>
    <Handle type="target" position={Position.Top} className="!bg-indigo-300" />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-indigo-300"
    />
  </div>
)

const LeaderNode = ({ data }: NodeProps) => (
  <div className="flex min-w-[180px] items-center gap-3 rounded-full border-2 border-amber-400 bg-amber-50 px-4 py-2 shadow-sm">
    <div className="rounded-full bg-amber-500 p-1.5 text-white">
      <ShieldCheck size={14} />
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-amber-600 uppercase">
        Trưởng nhóm
      </span>
      <span className="max-w-[100px] truncate text-xs font-bold text-slate-800">
        {data.fullName}
      </span>
    </div>
    <Handle type="target" position={Position.Top} className="!bg-amber-400" />
  </div>
)

const MemberNode = ({ data }: NodeProps) => (
  <div className="flex min-w-[160px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
    <div className="h-2 w-2 rounded-full bg-emerald-400" />
    <span className="truncate text-xs font-medium text-slate-600">
      {data.fullName}
    </span>
    <Handle type="target" position={Position.Left} className="!bg-slate-300" />
  </div>
)

const nodeTypes = {
  rootNode: RootNode,
  teamNode: TeamNode,
  leaderNode: LeaderNode,
  memberNode: MemberNode,
}

// --- CONTEXT MENU ---
const ContextMenu = ({ data, top, left, onClick, onClose }: any) => {
  if (["leaderNode", "memberNode"].includes(data.type)) return null

  return (
    <div
      style={{ top, left }}
      className="absolute z-[100] min-w-56 rounded-xl border border-slate-200 bg-white/95 py-2 shadow-2xl backdrop-blur-md transition-all"
      onMouseLeave={onClose}
    >
      <div className="mb-1 border-b border-slate-100 px-4 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        {data.name}
      </div>

      {/* Logic hiển thị dựa trên loại Node */}
      {data.type === "rootNode" ? (
        <button
          onClick={() => onClick("add-team", data)}
          className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <Plus size={16} className="mr-3 text-blue-500" /> Thêm Team mới
        </button>
      ) : (
        <>
          <button
            onClick={() => onClick("add-member", data)}
            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <UserPlus size={16} className="mr-3 text-emerald-500" /> Thêm thành
            viên
          </button>
          <button
            onClick={() => onClick("edit-team", data)}
            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Pencil size={16} className="mr-3 text-slate-400" /> Sửa thông tin
            Team
          </button>
        </>
      )}

      {!data.isRoot && (
        <button
          onClick={() => onClick("delete", data)}
          className="mt-1 flex w-full items-center border-t border-slate-50 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-3" /> Xóa
        </button>
      )}
    </div>
  )
}

// --- MAIN COMPONENT ---
export function TeamTree({
  treeData,
  rootName,
  storeId,
}: {
  treeData: ITeam[]
  rootName: string
  storeId: string
}) {
  const [isTeamOpen, setIsTeamOpen] = useState(false)
  const [isMemberOpen, setIsMemberOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [menu, setMenu] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { nodes, edges } = useMemo(() => {
    const rawNodes: any[] = []
    const rawEdges: any[] = []

    const rootId = `ROOT-${storeId}`
    rawNodes.push({
      id: rootId,
      type: "rootNode",
      data: { name: rootName, isRoot: true, type: "rootNode" },
      position: { x: 0, y: 0 },
    })

    treeData.forEach((team) => {
      // Node Team
      rawNodes.push({
        id: team.id,
        type: "teamNode",
        data: { ...team, type: "teamNode" },
        position: { x: 0, y: 0 },
      })

      rawEdges.push({
        id: `e-${rootId}-${team.id}`,
        source: rootId,
        target: team.id,
        style: { stroke: "#6366f1", strokeWidth: 2 },
      })

      // Leader
      if (team.leader) {
        const lId = `leader-${team.id}-${team.leader.id}`
        rawNodes.push({
          id: lId,
          type: "leaderNode",
          data: team.leader,
          position: { x: 0, y: 0 },
        })
        rawEdges.push({
          id: `el-${team.id}`,
          source: team.id,
          target: lId,
          style: { stroke: "#f59e0b" },
        })
      }

      // Members
      if (team.members) {
        team.members.forEach((m) => {
          if (m.id === team.leader?.id) return
          const mId = `mem-${team.id}-${m.id}`
          rawNodes.push({
            id: mId,
            type: "memberNode",
            data: m,
            position: { x: 0, y: 0 },
          })
          rawEdges.push({
            id: `em-${mId}`,
            source: team.id,
            target: mId,
            style: { stroke: "#cbd5e1" },
          })
        })
      }
    })

    return getLayoutElements(rawNodes, rawEdges)
  }, [treeData, rootName, storeId])

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

  const handleAction = (action: string, data: any) => {
    setMenu(null)
    setSelectedNode(data)
    if (action === "add-team") setIsTeamOpen(true)
    if (action === "add-member") setIsMemberOpen(true)
    if (action === "delete") alert("Xử lý xóa ID: " + data.id)
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-[calc(100vh-220px)] w-full overflow-hidden rounded-3xl border bg-slate-50/50 shadow-inner"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={() => setMenu(null)}
          fitView
        >
          <Background variant={BackgroundVariant.Lines} color="#f1f5f9" />
          <Controls />
          {menu && (
            <ContextMenu
              onClick={handleAction}
              onClose={() => setMenu(null)}
              {...menu}
            />
          )}
        </ReactFlow>
      </div>

      <TeamAdd
        open={isTeamOpen}
        onOpenChange={setIsTeamOpen}
        storeId={storeId}
        selectedParent={selectedNode}
      />

      {/* MemberAdd Modal xử lý thêm người vào Team */}
      {/* <MemberAdd 
        open={isMemberOpen} 
        onOpenChange={setIsMemberOpen} 
        teamId={selectedNode?.id} 
      /> */}
    </>
  )
}
