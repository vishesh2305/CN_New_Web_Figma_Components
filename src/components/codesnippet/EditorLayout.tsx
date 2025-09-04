"use client"

import { useState } from "react"
import { CodeEditor, Sidebar, FileType } from "@/components/codesnippet"

export default function EditorLayout() {
  const [showSidebar, setShowSidebar] = useState(true)

  const files: FileType[] = [
    { name: "index.js", type: "js" },
    { name: "styles.css", type: "css" },
    { name: "buttonAnimation.js", type: "js" },
  ]

  return (
    <main className="flex w-full h-screen">
  
      {showSidebar && (
        <Sidebar files={files} onClose={() => setShowSidebar(false)} />
      )}

      
      <div className="flex-1 relative">
        {!showSidebar && (
          <button onClick={() => setShowSidebar(true)} className=" absolute top-10 right-2 bg-black text-white px-4 py-1 rounded">
            ☰
          </button>
        )}
        <CodeEditor />
      </div>
    </main>
  )
}
