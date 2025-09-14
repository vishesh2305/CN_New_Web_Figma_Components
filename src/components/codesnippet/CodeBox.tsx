"use client";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CodeBoxProps = {
  title: string;
  filename: string;
  code: string;
  caption: string;
  files: string[];
  hoverText?: string;
  AsciiArtComponent?: React.FC;
};

export default function CodeBox({
  title,
  filename,
  code,
  caption,
  files,
  AsciiArtComponent,
}: CodeBoxProps) {
  const [activeFile, setActiveFile] = useState<string | null>(filename);
  const [openFiles, setOpenFiles] = useState<string[]>([filename]);
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>(
    {}
  );
  const [isHovered, setIsHovered] = useState(false);
  
  // States to manage the animation
  const [isMonochrome, setIsMonochrome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedCode, setDisplayedCode] = useState("");

  // Handles the Tab key press to start the animation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && isMonochrome) {
        event.preventDefault();
        setIsMonochrome(false);
        setIsTyping(true);
        setDisplayedCode(""); // Reset for typing
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMonochrome]);

  // Handles the typewriter effect
  useEffect(() => {
    if (isTyping) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedCode(code.substring(0, i));
        i++;
        if (i > code.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, 10); // Adjust typing speed here (lower is faster)
      return () => clearInterval(intervalId);
    }
  }, [isTyping, code]);


  useEffect(() => {
    const initialContents: { [key: string]: string } = {};
    initialContents[filename] = code;
    files.forEach((f) => {
      if (f !== filename) {
        initialContents[f] = `// Code for ${f}\n`;
      }
    });
    setFileContents(initialContents);
    setActiveFile(filename);
    setOpenFiles([filename]);
  }, [code, filename, files]);

  const handleFileSelect = (file: string) => {
    if (!openFiles.includes(file)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
  };

  const handleCloseFile = (fileToClose: string) => {
    const newOpenFiles = openFiles.filter((f) => f !== fileToClose);
    if (activeFile === fileToClose) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || null);
    }
    setOpenFiles(newOpenFiles);
  };

  return (
    <motion.div
      className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg shadow-2xl text-white flex flex-col h-full overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between bg-[#2d2d30] px-3 py-2 border-b border-[#3c3c3c] z-10 relative">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-[#ff5f57] rounded-full"></div>
            <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
            <div className="w-3 h-3 bg-[#28ca42] rounded-full"></div>
          </div>
          <span className="text-[#cccccc] ml-2">{title}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {files.length > 0 && (
          <div className="w-64 bg-[#252526] border-r border-[#3c3c3c] p-2 z-10 relative">
            <div className="text-[#cccccc] text-xs font-medium mb-2 px-2">
              Files
            </div>
            <div className="space-y-0.5">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  onClick={() => handleFileSelect(file)}
                  className={`text-xs text-[#cccccc] px-2 py-1 rounded cursor-pointer truncate ${
                    activeFile === file
                      ? "bg-[#2a2d2e]"
                      : "hover:bg-[#2a2d2e]"
                  }`}
                >
                  📄 {file}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col relative z-10">
          <div className="bg-[#2d2d30] border-b border-[#3c3c3c] flex z-10 relative">
            {openFiles.map((file) => (
              <div
                key={file}
                onClick={() => setActiveFile(file)}
                className={`flex items-center cursor-pointer px-3 py-1.5 text-xs ${
                  activeFile === file
                    ? "bg-[#1e1e1e] text-[#cccccc] border-t-2 border-[#0078d4]"
                    : "text-[#858585]"
                }`}
              >
                <span>📄 {file}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseFile(file);
                  }}
                  className="ml-2 text-[#858585] hover:text-white rounded-full hover:bg-white/10 p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 font-mono text-sm relative">
            {activeFile ? (
              <Editor
                height="100%"
                language="javascript"
                theme={isMonochrome ? "grayscale-theme" : "vs-dark"}
                value={isTyping ? displayedCode : code}
                onMount={(editor, monaco) => {
                  monaco.editor.defineTheme("grayscale-theme", {
                    base: "vs-dark",
                    inherit: true,
                    rules: [{ token: "", foreground: "c0c0c0" }],
                    colors: {
                      "editor.background": "#1e1e1e",
                      "editor.foreground": "#c0c0c0",
                      "editorCursor.foreground": "#ffffff",
                      "editor.lineHighlightBackground": "#2d2d30",
                    },
                  });
                }}
                options={{
                  minimap: { enabled: false },
                  scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden",
                  },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: "on",
                  readOnly: isMonochrome || isTyping,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a file to start editing
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isHovered && AsciiArtComponent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center pointer-events-none z-20 rounded-lg"
            >
              <div className="transform scale-[0.5] pointer-events-auto">
                <AsciiArtComponent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="bg-[#42a5f5] text-white text-xs px-4 py-2.5 flex items-center justify-between border-t border-[#1976d2] relative z-10"
        whileHover={{ backgroundColor: "#1976d2" }}
      >
        <span className="font-medium">{caption}</span>
        <div className="flex items-center gap-4 text-[#e3f2fd] opacity-75">
          <span>JavaScript</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
      </motion.div>
    </motion.div>
  );
}