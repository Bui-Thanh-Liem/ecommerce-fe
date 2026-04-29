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
import dagre from "dagre" // Import dagre
import { MapPin, Map, Plus, Pencil, Trash2 } from "lucide-react"
import {
  useCreateLocationRegion,
  useGetTreeDataByRootId,
} from "@/hooks/use-location-region"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"
import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { CreateLocationRegionSchema } from "@/shared/dtos/req/create-location-region.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// --- Cấu hình Dagre để tính toán vị trí ---
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 200 // Chiều rộng node (min-w-48)
const nodeHeight = 80 // Chiều cao node ước tính

const getLayoutedElements = (nodes: any[], edges: any[]) => {
  // 'TB' nghĩa là Top-Bottom (từ trên xuống dưới)
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 70, ranksep: 100 })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      // Dagre tính toán tọa độ tại tâm của node, ta cần trừ đi một nửa để khớp với React Flow
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

// --- Component Context Menu ---
const ContextMenu = ({ id, name, type, top, left, onClick, onClose }: any) => {
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
          onClick={() => onClick("add", id, name, type)}
          className="flex w-full items-center px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#0979B1]"
        >
          <Plus size={14} className="mr-2" /> Thêm cấp con
        </button>
      )}
      <button
        onClick={() => onClick("edit", id, name, type)}
        className="flex w-full items-center px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
      >
        <Pencil size={14} className="mr-2" /> Chỉnh sửa
      </button>
      <hr className="my-1 border-slate-100" />
      <button
        onClick={() => onClick("delete", id, name, type)}
        className="flex w-full items-center px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 size={14} className="mr-2" /> Xóa khu vực
      </button>
    </div>
  )
}

// --- Custom Node UI ---
const LocationNode = ({ data }: { data: ILocationRegion }) => {
  const isProvince = data.type === LocationRegionType.PROVINCE_CITY
  const isDistrict = data.type === LocationRegionType.DISTRICT_TOWN

  return (
    <div className="min-w-48 rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition-all hover:border-[#0979B1] hover:shadow-md">
      <div className="flex items-center">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-inner ${
            isProvince
              ? "bg-red-400"
              : isDistrict
                ? "bg-blue-400"
                : "bg-emerald-400"
          }`}
        >
          {isProvince ? <Map size={20} /> : <MapPin size={20} />}
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

export default function LocationRegionPage() {
  const [open, setOpen] = useState(false)
  const [parent, setParent] = useState<ILocationRegion | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<any>(null)

  const { data } = useGetTreeDataByRootId(
    "6f95cd5e-a354-4dac-ad25-e1336e703482"
  )
  const treeData = data?.metadata || []
  const createLocationRegionApi = useCreateLocationRegion()

  const form = useForm<z.infer<typeof CreateLocationRegionSchema>>({
    resolver: zodResolver(CreateLocationRegionSchema),
    defaultValues: {
      name: "",
      parent: "",
      type: LocationRegionType.PROVINCE_CITY,
    },
  })

  const onSubmit = async (
    values: z.infer<typeof CreateLocationRegionSchema>
  ) => {
    try {
      const res = await createLocationRegionApi.mutateAsync({
        name: values.name,
        type: values.type,
        parent: values.parent,
      })
      if (res?.statusCode === 201) {
        setOpen(false)
        form.reset()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault()
      if (!containerRef.current) return
      const pane = containerRef.current.getBoundingClientRect()
      setMenu({
        id: node.id,
        name: node.name,
        type: node.data.type,
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
      })
    },
    []
  )

  const handleMenuAction = (
    action: string,
    id: string,
    name: string,
    type: LocationRegionType
  ) => {
    setParent({ id, name, type } as ILocationRegion)
    form.setValue("parent", id)
    if (action === "add") {
      if (type === LocationRegionType.PROVINCE_CITY)
        form.setValue("type", LocationRegionType.DISTRICT_TOWN)
      else if (type === LocationRegionType.DISTRICT_TOWN)
        form.setValue("type", LocationRegionType.WARD_COMMUNE)
    }
    setOpen(true)
    setMenu(null)
  }

  // Sử dụng Dagre để lấy nodes và edges có vị trí chuẩn
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
    return getLayoutedElements(rawNodes, rawEdges)
  }, [treeData])

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-120px)] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Location Region</DialogTitle>
            <DialogDescription>
              Create a new sub-region for {parent?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {parent && (
              <FieldGroup>
                <Controller
                  name="parent"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Parent Node</FieldLabel>
                      <Input disabled value={parent.name} />
                      <input type="hidden" {...field} />
                    </Field>
                  )}
                />
              </FieldGroup>
            )}
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} placeholder="Enter name..." />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Type</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(LocationRegionType).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLocationRegionApi.isPending}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
