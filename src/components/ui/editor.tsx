"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Color from "@tiptap/extension-color"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useCallback, useRef, useState } from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  CodeSquare,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react"
import { TextStyle } from "@tiptap/extension-text-style"

interface EditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
}

interface ToolButtonProps {
  onClick?: () => void
  isActive?: boolean
  disabled?: boolean
  icon: React.ReactNode
  title?: string
}

function ToolButton({
  onClick,
  isActive,
  disabled,
  icon,
  title,
}: ToolButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      disabled={disabled}
      title={title}
      className={`rounded p-2 transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "bg-white text-gray-700 hover:bg-gray-100"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      {icon}
    </button>
  )
}

export const Editor = ({
  value = "",
  onChange,
  className = "",
  editable = true,
  placeholder = "Enter content...",
}: EditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. THÊM STATE NÀY ĐỂ ÉP REACT RE-RENDER TOOLBAR
  const [, setSelectionTick] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "mx-auto global-editor-image", // 'mx-auto' giúp tự căn giữa khi được đặt thuộc tính text-align
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    // 2. SỬ DỤNG HOOK CHUẨN NÀY ĐỂ CẬP NHẬT STATE MỖI KHI CON TRỎ DI CHUYỂN HOẶC BÔI ĐEN
    onSelectionUpdate: () => {
      // Mỗi lần bôi đen hoặc click chuột, số này tăng lên -> ép Toolbar kiểm tra lại isActive()
      setSelectionTick((tick) => tick + 1)
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none max-w-none",
      },
    },
  })

  useEffect(() => {
    if (!editor) return

    // Nếu dữ liệu từ React Hook Form khác với nội dung hiện tại trong Editor thì mới cập nhật
    if (editor.getHTML() !== value) {
      // Xử lý trường hợp value rỗng hoặc undefined để không bị lỗi nội dung cũ lưu luyến
      editor.commands.setContent(value || "")
    }
  }, [value, editor])

  const handleImageUpload = useCallback(
    (file: File) => {
      if (!editor) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        editor.chain().focus().setImage({ src: base64 }).run()
      }
      reader.readAsDataURL(file)
    },
    [editor]
  )

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addLink = () => {
    const url = prompt("URL:")
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run()
    }
  }

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 bg-gray-50 p-3">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold size={18} />}
            title="Đậm (Ctrl+B)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic size={18} />}
            title="Nghiêng (Ctrl+I)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<Strikethrough size={18} />}
            title="Gạch ngang"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={<Code size={18} />}
            title="Code"
          />
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={<Heading1 size={18} />}
            title="Tiêu đề 1"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={<Heading2 size={18} />}
            title="Tiêu đề 2"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={<Heading3 size={18} />}
            title="Tiêu đề 3"
          />
        </div>

        {/* Lists & Quotes */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List size={18} />}
            title="Danh sách"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered size={18} />}
            title="Danh sách số"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote size={18} />}
            title="Trích dẫn"
          />
        </div>

        {/* Code Block */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={<CodeSquare size={18} />}
            title="Code block"
          />
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={<AlignLeft size={18} />}
            title="Căn lề trái"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={<AlignCenter size={18} />}
            title="Căn giữa"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={<AlignRight size={18} />}
            title="Căn lề phải"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            icon={<AlignJustify size={18} />}
            title="Căn đều"
          />
        </div>

        {/* Links & Media */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolButton
            onClick={addLink}
            isActive={editor.isActive("link")}
            icon={<LinkIcon size={18} />}
            title="Thêm liên kết"
          />
          <ToolButton
            onClick={removeLink}
            disabled={!editor.isActive("link")} // Chỉ sáng lên khi con trỏ chuột đang nằm ở một đường link
            icon={
              <span className="relative">
                <LinkIcon size={18} />
                <span className="absolute -right-1 -bottom-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                  ×
                </span>
              </span>
            }
            title="Xóa liên kết"
          />
          <ToolButton
            onClick={handleImageClick}
            icon={<ImageIcon size={18} />}
            title="Thêm hình ảnh"
          />
        </div>

        {/* History */}
        <div className="flex gap-1">
          <ToolButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={<Undo2 size={18} />}
            title="Hoàn tác"
          />
          <ToolButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={<Redo2 size={18} />}
            title="Làm lại"
          />
        </div>
      </div>

      {/* Editor */}
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm min-h-96 max-w-none p-4 focus:outline-none"
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
