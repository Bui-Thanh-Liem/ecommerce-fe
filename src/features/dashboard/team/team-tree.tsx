"use client"

import React, { useMemo, useState, useCallback, useRef } from "react"
import {
  Background,
  Controls,
  ReactFlow,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import dagre from "dagre"
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  UserCircle,
  Building2,
} from "lucide-react"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldLabel } from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useCreateTeam } from "@/hooks/use-team"

const nodeWidth = 220
const nodeHeight = 80

const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 70, ranksep: 100 })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      }
    }),
    edges,
  }
}

// Menu chuột phải
const ContextMenu = ({ id, data, top, left, onClick, onClose }: any) => {
  return (
    <div
      style={{ top: `${top}px`, left: `${left}px` }}
      className="absolute z-[100] min-w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-200/50"
      onMouseLeave={onClose}
    >
      <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        {data.isRoot ? "Thao tác Gốc" : "Thao tác Team"}
      </div>
      <button
        onClick={() => onClick("add", data)}
        className="flex w-full items-center px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
      >
        <Plus size={14} className="mr-2" /> Thêm team con
      </button>
      {!data.isRoot && (
        <>
          <button
            onClick={() => onClick("edit", data)}
            className="flex w-full items-center px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Pencil size={14} className="mr-2" /> Chỉnh sửa
          </button>
          <hr className="my-1 border-slate-100" />
          <button
            onClick={() => onClick("delete", data)}
            className="flex w-full items-center px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} className="mr-2" /> Xóa team
          </button>
        </>
      )}
    </div>
  )
}

const TeamNode = ({ data }: { data: any }) => {
  const isRoot = data.isRoot
  return (
    <div
      className={`min-w-[220px] rounded-xl border p-3 shadow-sm transition-all hover:shadow-md ${isRoot ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-500"}`}
    >
      <div className="flex items-center">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-md ${isRoot ? "bg-blue-700" : "bg-slate-600"}`}
        >
          {isRoot ? <Building2 size={18} /> : <Users size={18} />}
        </div>
        <div className="ml-3 overflow-hidden">
          <div className="truncate text-sm font-bold text-slate-800">
            {data.name}
          </div>
          <div className="mt-0.5 flex items-center text-[10px] text-slate-500">
            <UserCircle size={10} className="mr-1" />
            <span className="truncate">
              {data.leader?.fullName || (isRoot ? "Admin" : "No leader")}
            </span>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  )
}

const nodeTypes = { team: TeamNode }

export function TeamTree({
  treeData,
  rootName,
  storeId,
}: {
  treeData: ITeam[]
  rootName: string
  storeId: string
}) {
  const [open, setOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<any>(null)
  const [menu, setMenu] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const createApi = useCreateTeam()

  const form = useForm({
    defaultValues: { name: "", parentId: "", storeId: "" },
  })

  const { nodes, edges } = useMemo(() => {
    const rawNodes: any[] = []
    const rawEdges: any[] = []

    // Tạo Virtual Root Node
    const virtualRootId = "VIRTUAL-ROOT"
    rawNodes.push({
      id: virtualRootId,
      type: "team",
      data: { id: virtualRootId, name: rootName, isRoot: true },
      position: { x: 0, y: 0 },
    })

    const traverse = (items: any[], pId: string) => {
      items.forEach((item) => {
        rawNodes.push({
          id: item.id,
          type: "team",
          data: item,
          position: { x: 0, y: 0 },
        })
        rawEdges.push({
          id: `e${pId}-${item.id}`,
          source: pId,
          target: item.id,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#3b82f6", strokeWidth: 2 },
        })
        if (item.children?.length > 0) traverse(item.children, item.id)
      })
    }

    traverse(treeData, virtualRootId)
    return getLayoutedElements(rawNodes, rawEdges)
  }, [treeData, rootName])

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

  const handleMenuAction = (action: string, data: any) => {
    if (action === "add") {
      setSelectedParent(data)
      // Nếu node cha là Virtual Root, parentId sẽ là null
      const actualParentId = data.isRoot ? null : data.id
      // Nếu storeId là "company-root" thì gửi rỗng, ngược lại gửi storeId
      const actualStoreId = storeId === "company-root" ? "" : storeId

      form.reset({
        name: "",
        parentId: actualParentId as any,
        storeId: actualStoreId,
      })
      setOpen(true)
    }
    setMenu(null)
  }

  const onSubmit = async (values: any) => {
    await createApi.mutateAsync(values)
    setOpen(false)
  }

  return (
    <>
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
          fitView
        >
          <Background gap={20} color="#e2e8f0" />
          <Controls />
          {menu && (
            <ContextMenu
              onClick={handleMenuAction}
              onClose={() => setMenu(null)}
              {...menu}
            />
          )}
        </ReactFlow>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Thêm team con vào [{selectedParent?.name}]
            </DialogTitle>
            <DialogDescription>
              Team mới sẽ thuộc{" "}
              {storeId === "company-root"
                ? "Hệ thống tổng"
                : "Chi nhánh hiện tại"}
              .
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <FieldLabel>Tên Team</FieldLabel>
              <Input
                {...form.register("name")}
                placeholder="Ví dụ: Team Marketing"
              />
            </FieldGroup>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createApi.isPending}>
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
