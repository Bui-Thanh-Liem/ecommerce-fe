"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VALUE_HEADQUARTER } from "@/shared/constants/team.constant"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IStaff } from "@/shared/interfaces/models/staff.interface"
import { IStore } from "@/shared/interfaces/models/store.interface"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { getLayoutElements } from "@/utils/diagram.util"
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Panel,
  Position,
  ReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  Building2,
  ChevronsUp,
  Layers,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react"
import React, { useCallback, useMemo, useRef, useState } from "react"

// --- CUSTOM NODES ---
const RootNode = ({ data }: { data: IStore }) => (
  <div className="min-w-65 rounded-2xl border-2 border-orange-600 bg-orange-400 p-4 shadow-xl">
    <div className="flex items-center gap-3 text-white">
      <div className="rounded-lg bg-white/20 p-2">
        <Building2 size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase opacity-80">
          {data.name}
        </p>
        <p className="text-lg leading-tight font-black">{VALUE_HEADQUARTER}</p>
      </div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3! w-3! bg-orange-400!"
    />
  </div>
)

const TeamNode = ({ data }: { data: ITeam }) => (
  <div className="group min-w-55 rounded-xl border-2 border-indigo-200 bg-white p-3 shadow-md transition-all hover:border-indigo-500">
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
      <Users size={12} /> <span>{data.members?.length || 0} members</span>
    </div>
    <Handle type="target" position={Position.Top} className="bg-indigo-300!" />
    <Handle
      type="source"
      position={Position.Bottom}
      className="bg-indigo-300!"
    />
  </div>
)

const LeaderNode = ({ data }: { data: IStaff }) => (
  <div className="flex min-w-45 items-center gap-3 rounded-full border-2 border-amber-400 bg-amber-50 px-4 py-2 shadow-sm">
    <Avatar>
      <AvatarImage src={data.avatarUrl} />
      <AvatarFallback>AV</AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-amber-600 uppercase">
        Team Leader
      </span>
      <span className="max-w-25 truncate text-xs font-bold text-slate-800">
        {data.fullName}
      </span>
    </div>
    <Handle type="target" position={Position.Top} className="bg-amber-400!" />
  </div>
)

const MemberNode = ({ data }: { data: IStaff }) => (
  <div className="flex min-w-40 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
    <Avatar>
      <AvatarImage src={data.avatarUrl} />
      <AvatarFallback>AV</AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-400 uppercase">
        Team Member
      </span>
      <span className="truncate text-xs font-medium text-slate-800">
        {data.fullName}
      </span>
    </div>
    <Handle type="target" position={Position.Left} className="bg-slate-300!" />
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
  if (data.type === "leaderNode") return null

  if (data.type === "memberNode") {
    return (
      <div
        style={{ top, left }}
        className="absolute z-100 min-w-56 rounded-xl border border-slate-200 bg-white/95 py-2 shadow-2xl backdrop-blur-md transition-all"
        onMouseLeave={onClose}
      >
        <div className="mb-1 border-b border-slate-100 px-4 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          {data?.fullName}
        </div>
        <button
          onClick={() =>
            onClick("promote-to-leader", { staffId: data.id, team: data.team })
          }
          className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <ChevronsUp size={20} className="mr-3 text-emerald-500" />
          Promoted to Team Leader
        </button>
        <button
          onClick={() =>
            onClick("delete-member", { staffId: data.id, team: data.team })
          }
          className="mt-1 flex w-full items-center border-t border-slate-50 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-3" /> Delete Member
        </button>
      </div>
    )
  }

  return (
    <div
      style={{ top, left }}
      className="absolute z-100 min-w-56 rounded-xl border border-slate-200 bg-white/95 py-2 shadow-2xl backdrop-blur-md transition-all"
      onMouseLeave={onClose}
    >
      <div className="mb-1 border-b border-slate-100 px-4 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        {data.name}
      </div>

      {/* Logic hiển thị dựa trên loại Node */}
      {data.type === "rootNode" ? (
        <button
          onClick={() => onClick("create", data)}
          className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600"
        >
          <Plus size={16} className="mr-3 text-orange-500" /> Add New Team
        </button>
      ) : (
        <>
          <button
            onClick={() => onClick("add-member", data)}
            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <UserPlus size={16} className="mr-3 text-emerald-500" /> Add Member
            to Team
          </button>
          <button
            onClick={() => onClick("edit", data)}
            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Pencil size={16} className="mr-3 text-slate-400" /> Edit Team
            Information
          </button>
        </>
      )}

      {!data.isRoot && (
        <button
          onClick={() => onClick("delete", data)}
          className="mt-1 flex w-full items-center border-t border-slate-50 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-3" /> Delete
        </button>
      )}
    </div>
  )
}

interface ITeamHierarchyProps {
  storeId: string
  onEdit?: (team: ITeam) => void
  onCreate?: (team: ITeam) => void
  dataSource: ResMetadataDto<ITeam>
  onDelete?: (team: ITeam) => void
  addMember?: (team: ITeam) => void
  deleteMember?: (team: ITeam, staffId: string) => void
  promoteToLeader?: (team: ITeam, staffId: string) => void
}

// --- MAIN COMPONENT ---
export function TeamHierarchy({
  dataSource,
  storeId,
  onEdit,
  onCreate,
  onDelete,
  addMember,
  deleteMember,
  promoteToLeader,
}: ITeamHierarchyProps) {
  const { data } = dataSource

  const [menu, setMenu] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { nodes, edges } = useMemo(() => {
    const rawNodes: any[] = []
    const rawEdges: any[] = []

    const rootId = `ROOT-${storeId}`
    rawNodes.push({
      id: rootId,
      type: "rootNode",
      position: { x: 0, y: 0 },
      data: {
        isRoot: true,
        type: "rootNode",
        name: storeId === VALUE_HEADQUARTER ? VALUE_HEADQUARTER : "store",
      },
    })

    data.forEach((team) => {
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
          data: {
            ...team.leader,
            type: "leaderNode",
          },
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
            data: {
              ...m,
              team,
              type: "memberNode",
            },
            type: "memberNode",
            position: { x: 0, y: 0 },
          })
          rawEdges.push({
            target: mId,
            id: `em-${mId}`,
            source: team.id,
            style: { stroke: "#cbd5e1" },
          })
        })
      }
    })

    return getLayoutElements(rawNodes, rawEdges)
  }, [data, storeId])

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

  /**
   *
   * @description data: ITeam khi create/edit/delete team, add member vào team
   * @description data: {team, staffId} khi delete member khỏi team
   * @description data: {team, staffId} khi promote member lên làm leader
   */
  const handleAction = (action: string, data: any) => {
    setMenu(null)
    if (action === "create") onCreate?.(data)
    if (action === "edit") onEdit?.(data)
    if (action === "delete") onDelete?.(data)
    if (action === "add-member") addMember?.(data)

    //
    if (action === "delete-member") deleteMember?.(data.team, data.staffId)
    if (action === "promote-to-leader")
      promoteToLeader?.(data.team, data.staffId)
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-[calc(100vh-180px)] w-full overflow-hidden rounded-3xl border bg-slate-50/50 shadow-inner"
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
              Phân cấp đội nhóm
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
    </>
  )
}
