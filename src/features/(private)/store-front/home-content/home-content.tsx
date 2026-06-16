"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, GripVertical } from "lucide-react"
import { useFindOptionsTopBanners } from "@/hooks/apis/store-front/use-top-banner"
import {
  IDetailHomeConfig,
  IStoreFrontConfig,
} from "@/shared/interfaces/models/store-front/store-front-config.interface"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { useForm } from "react-hook-form"
import { UpdateStoreFrontConfigSchema } from "@/shared/dtos/req/store-front-config.dto"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TopBannerSelectInForm } from "@/components/select-in-form/top-banner"

// --- SKELETON COMPONENT với hiệu ứng Fade-out nhẹ ---
function HomeContentSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-4 gap-x-6 p-6 px-0 transition-all duration-300">
      <div className="col-span-3 max-h-[calc(100vh-200px)] min-h-100 space-y-2 rounded-2xl bg-slate-100 p-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-10 w-full rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="col-span-1 flex flex-col justify-between rounded-2xl bg-slate-100 p-4">
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
            <div className="h-4 w-40 rounded bg-slate-200" />
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-4 w-3/4 rounded bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-3">
          <div className="h-10 rounded-lg bg-slate-200" />
          <div className="h-10 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

// --- 1. COMPONENT SORTABLE ITEM ---
function SortableItem({
  id,
  label,
  className,
  onGoToDetail,
}: {
  id: string
  label: string
  className: string
  onGoToDetail: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} group mb-2 flex h-10 items-center justify-between rounded-2xl px-4 font-medium text-white shadow-sm select-none`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex h-full flex-1 cursor-grab items-center gap-x-2 active:cursor-grabbing"
      >
        <GripVertical
          size={18}
          className="opacity-60 transition-opacity group-hover:opacity-100"
        />
        <span>{label}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onGoToDetail()
        }}
        className="hidden items-center justify-center rounded-full p-1 text-white transition-all group-hover:flex hover:bg-white/20"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  )
}

// --- 2. COMPONENT CHI TIẾT ---
function BlockDetailConfig({
  label,
  onBack,
  blockId,
  storeFrontConfig,
}: {
  label: string
  onBack: () => void
  blockId: keyof IDetailHomeConfig
  storeFrontConfig: IStoreFrontConfig | null
}) {
  const isTopBanner = blockId === "topBanner"
  const { data: topBannerRes } = useFindOptionsTopBanners({
    enabled: isTopBanner,
  })

  const form = useForm<z.infer<typeof UpdateStoreFrontConfigSchema>>({
    resolver: zodResolver(UpdateStoreFrontConfigSchema),
  })

  //
  useEffect(() => {
    if (storeFrontConfig) {
      form.reset({
        ...storeFrontConfig,
      })
    }
  }, [form, storeFrontConfig])

  async function onSubmit(data: z.infer<typeof UpdateStoreFrontConfigSchema>) {}

  return (
    <div className="animate-in fade-in duration-300">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 flex items-center gap-x-2 p-0 text-slate-600 hover:bg-transparent hover:text-sky-600"
      >
        <ArrowLeft size={16} /> back to list
      </Button>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-lg font-bold text-slate-800">
          Detailed configuration: <span className="text-sky-600">{label}</span>
        </h3>
        <p className="mb-6 text-xs text-slate-400">Block code: {blockId}</p>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {isTopBanner && (
            <TopBannerSelectInForm
              form={form}
              multiple={false}
              name="homeConfig.topBanner"
            />
          )}
        </form>
        <div className="flex min-h-50 flex-col items-center justify-center space-y-4 rounded-lg border border-dashed bg-slate-50 text-slate-400">
          <p>Nơi fetch dữ liệu cho {blockId}</p>
        </div>
      </div>
    </div>
  )
}

// --- 3. COMPONENT CHÍNH ---
export function HomeContent({
  isLoading,
  storeFrontConfig,
}: {
  isLoading: boolean
  storeFrontConfig: IStoreFrontConfig | null
}) {
  const { mutateAsync } = useUpdateStoreFrontConfig()

  // Trạng thái kiểm soát việc đóng màn hình loading thực tế dựa trên animation
  const [showRealContent, setShowRealContent] = useState(false)

  const [blocks, setBlocks] = useState<
    { id: keyof IDetailHomeConfig; label: string; color: string }[]
  >([
    { id: "topBanner", label: "Top banner", color: "bg-sky-400" },
    { id: "header", label: "Header", color: "bg-sky-500" },
    { id: "menu", label: "Menu", color: "bg-sky-600" },
    { id: "mainBanner", label: "Main banner", color: "bg-sky-700" },
    { id: "listCategories", label: "List categories", color: "bg-sky-800" },
    { id: "historyProducts", label: "History products", color: "bg-sky-900" },
    { id: "mktSessionOne", label: "Mkt session one", color: "bg-blue-400" },
    { id: "mktSessionTwo", label: "Mkt session two", color: "bg-blue-500" },
    { id: "suggestForYou", label: "Suggest for you", color: "bg-blue-600" },
    { id: "mktSessionThree", label: "Mkt session three", color: "bg-blue-700" },
    { id: "mktSessionFour", label: "Mkt session four", color: "bg-blue-800" },
    { id: "mktSessionFive", label: "Mkt session five", color: "bg-blue-900" },
    { id: "topic", label: "Topic", color: "bg-slate-700" },
  ])

  useEffect(() => {
    // 1. Nếu đang API đang load, reset trạng thái hiển thị content thực
    if (isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowRealContent(false)
      return
    }

    // 2. Nếu API chạy xong (isLoading = false), tiến hành sắp xếp mảng
    if (storeFrontConfig?.homeConfig?.order) {
      const orderMap: Record<string, number> = {}
      storeFrontConfig.homeConfig.order.forEach((id, index) => {
        orderMap[id] = index
      })

      setBlocks((prevBlocks) =>
        [...prevBlocks].sort((a, b) => {
          const indexA =
            orderMap[a.id] !== undefined ? orderMap[a.id] : Infinity
          const indexB =
            orderMap[b.id] !== undefined ? orderMap[b.id] : Infinity
          return indexA - indexB
        })
      )
    }

    // 3. GIẢI PHÁP CHỐNG CHỚP: Ép skeleton chạy tối thiểu 400ms thay vì tắt ngay lập tức
    const timer = setTimeout(() => {
      setShowRealContent(true)
    }, 500) // Bạn có thể chỉnh lên 500ms nếu muốn mượt hơn nữa

    return () => clearTimeout(timer)
  }, [storeFrontConfig, isLoading])

  const [activeDetailBlock, setActiveDetailBlock] = useState<
    keyof IDetailHomeConfig | null
  >(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSaveConfig = async () => {
    const newOrderKeys = blocks.map((b) => b.id)
    await mutateAsync({
      id: storeFrontConfig?.id || "",
      payload: { homeConfig: { order: newOrderKeys } },
    })
  }

  // Nếu chưa hết thời gian timeout tối thiểu, tiếp tục giữ skeleton
  if (!showRealContent) {
    return <HomeContentSkeleton />
  }

  const selectedBlockInfo = blocks.find((b) => b.id === activeDetailBlock)

  return (
    // Sử dụng lớp animate-in fade-in (Tailwind animate) để danh sách mờ dần hiện ra rất dễ chịu
    <div className="animate-in fade-in grid grid-cols-4 gap-x-6 p-6 px-0 duration-500 ease-in-out">
      {/* Cột trái */}
      <div className="col-span-3 max-h-[calc(100vh-200px)] min-h-100 overflow-x-hidden overflow-y-auto rounded-2xl bg-sky-50 p-4">
        {activeDetailBlock === null ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block) => (
                <SortableItem
                  key={block.id}
                  id={block.id}
                  label={block.label}
                  className={block.color}
                  onGoToDetail={() => setActiveDetailBlock(block.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <BlockDetailConfig
            blockId={activeDetailBlock}
            storeFrontConfig={storeFrontConfig}
            label={selectedBlockInfo?.label || ""}
            onBack={() => setActiveDetailBlock(null)}
          />
        )}
      </div>

      {/* Cột phải */}
      <div className="col-span-1 flex flex-col justify-between rounded-2xl bg-sky-50 p-4">
        <div className="mb-4">
          <div className="mb-2 text-lg font-bold text-slate-700">
            Configuration
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-3 text-sm text-slate-600">
            <p className="mb-4 font-semibold text-blue-600">
              Current display order:
            </p>
            <div className="space-y-3">
              {blocks.map((b, index) => (
                <div
                  key={b.id}
                  className={
                    activeDetailBlock === b.id
                      ? "animate-pulse font-bold text-sky-600"
                      : ""
                  }
                >
                  {index + 1}. {b.label}{" "}
                  {activeDetailBlock === b.id && " (Editing...)"}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button className="mt-auto" onClick={handleSaveConfig}>
          Save Config
        </Button>
      </div>
    </div>
  )
}
