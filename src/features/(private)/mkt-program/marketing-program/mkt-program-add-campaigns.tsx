import { CampaignSelectInForm } from "@/components/select-in-form/campaign"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogFooterAction,
  DialogHeaderAction,
} from "@/components/ui/dialog"
import { useUpdateMktProgram } from "@/hooks/apis/mkt-program/use-mkt-program"
import { UpdateMktProgramSchema } from "@/shared/dtos/req/mkt-program.dto"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof UpdateMktProgramSchema> = {
  campaigns: [],
}

//
export function MktProgramAddCampaigns({
  open,
  onClose,
  mktProgram,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  mktProgram: IMarketingProgram
  onOpenChange?: (open: boolean) => void
}) {
  const router = useRouter()
  const updateApi = useUpdateMktProgram()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof UpdateMktProgramSchema>>({
    resolver: zodResolver(UpdateMktProgramSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi initialData
  useEffect(() => {
    if (mktProgram) {
      form.reset({
        ...initFormValue,
        campaigns: mktProgram.campaigns?.map((c) => c.id) || [],
      })
    }
  }, [form, mktProgram])

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      form.reset(initFormValue)
    }
  }

  //
  async function onSubmit(data: z.infer<typeof UpdateMktProgramSchema>) {
    setIsPending(true)

    try {
      const res = await updateApi.mutateAsync({
        id: mktProgram.id,
        payload: {
          ...data,
        },
      })

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process marketing program:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeaderAction
          title="Add Campaign to Marketing Program"
          desc="Select campaigns to add to this marketing program."
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-4 space-y-6">
            <CampaignSelectInForm
              multiple
              form={form}
              name="campaigns"
              label="Campaigns"
            />
          </div>
          <DialogFooterAction
            onClose={onClose}
            isPending={isPending}
            extraAction={() => (
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/marketing-programs/campaigns?m=${mktProgram.id}`
                    )
                  }
                >
                  Create new campaign with this program
                </Button>
              </DialogFooter>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
