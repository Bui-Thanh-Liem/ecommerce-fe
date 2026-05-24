import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

export function RenderBlog({
  content,
  contentBtn = "View blog",
}: {
  content: string
  contentBtn?: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{contentBtn}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-max">
        <div
          className="prose max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
          dangerouslySetInnerHTML={{
            __html:
              content ||
              '<p class="flex items-center justify-center">Empty</p>',
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
