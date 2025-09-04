
"use client"

import { X } from "lucide-react"

export type FileType = {
  name: string
  type: "js" | "css"
}

interface SidebarProps {
  files: FileType[]
  onClose: () => void
}

export default function Sidebar({ files, onClose }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-gray-200 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <span className="font-semibold">Files</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <input
          type="text"
          placeholder="Search files..."
          className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-gray-200 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* File List */}
      <ul className="flex-1 overflow-y-auto text-sm">
        {files.map((file, i) => (
          <li
            key={i}
            className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
          >
            <span className="text-xs">
              {file.type === "js" ? "📄" : "🎨"}
            </span>
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
