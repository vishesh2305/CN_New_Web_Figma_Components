"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"

export default function CodeEditor() {
  const [code, setCode] = useState("// Write your code here")

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100">
     
      <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-300">
        <div className="bg-gray-800 text-white px-4 py-2 font-mono text-sm">
          Code Editor
        </div>
        <Editor
          height="calc(100% - 40px)"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>

    
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white shadow-inner">
        <div className="bg-gray-800 text-white px-4 py-2 font-mono text-sm">
          Live Preview
        </div>
        <iframe
          title="preview"
          className="w-full h-[calc(100%-40px)]"
          sandbox="allow-scripts"
          srcDoc={`<!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: sans-serif; padding: 1rem; }
                </style>
              </head>
              <body>
                <script>
                  try {
                    ${code}
                  } catch(err) {
                    document.body.innerHTML =
                      "<pre style='color:red; font-family:monospace'>" + err + "</pre>"
                  }
                </script>
              </body>
            </html>`}
        />
      </div>
    </div>
  )
}
