"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Highlight } from "prism-react-renderer";

const vsCodeDark = {
  plain: { color: "#d4d4d4", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "#6a9955", fontStyle: "italic" as const } },
    { types: ["string"], style: { color: "#ce9178" } },
    { types: ["keyword"], style: { color: "#569cd6" } },
    { types: ["function"], style: { color: "#dcdcaa" } },
    { types: ["variable"], style: { color: "#9cdcfe" } },
    { types: ["number"], style: { color: "#b5cea8" } },
    { types: ["punctuation"], style: { color: "#d4d4d4" } },
    { types: ["operator"], style: { color: "#d4d4d4" } },
    { types: ["constant"], style: { color: "#4fc1ff" } },
  ],
};

type CodeBoxProps = {
  title: string;
  filename: string;
  code: string;
  caption: string;
  files: string[];
};

export default function CodeBox({ title, filename, code, caption, files }: CodeBoxProps) {
  const [hovered, setHovered] = useState(false);
  const [typedCode, setTypedCode] = useState(code || ""); // default to full code so no empty renders
  const [isLoaded, setIsLoaded] = useState(false);

  const lines = code.split("\n");
  const charDelay = 30;
  const lineDelay = 200;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hovered) {
      setTypedCode(""); // start empty for typing effect
      let currentLine = 0;
      let currentChar = 0;
      const type = () => {
        if (currentLine < lines.length) {
          if (currentChar < lines[currentLine].length) {
            setTypedCode((prev) => (prev ?? "") + lines[currentLine][currentChar]); // always fallback to ""
            currentChar++;
            timer = setTimeout(type, charDelay);
          } else {
            setTypedCode((prev) => (prev ?? "") + "\n");
            currentLine++;
            currentChar = 0;
            timer = setTimeout(type, lineDelay);
          }
        }
      };
      type();
    } else {
      setTypedCode(code); // reset full code when hover ends
    }
    return () => clearTimeout(timer);
  }, [hovered, code]);

  // Safe code for rendering line numbers even when typedCode is empty
  const linesToShow = (typedCode || "").split("\n");

  return (
    <motion.div
      className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg shadow-2xl text-white flex flex-col h-full overflow-hidden"
      whileHover={{ scale: 1.01 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#2d2d30] px-3 py-2 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-[#ff5f57] rounded-full"></div>
            <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
            <div className="w-3 h-3 bg-[#28ca42] rounded-full"></div>
          </div>
          <span className="text-[#cccccc] ml-2">{title}</span>
        </div>
      </div>

      {/* File Explorer + Code Editor */}
      <div className="flex flex-1 overflow-hidden">
        {files.length > 0 && (
          <div className="w-64 bg-[#252526] border-r border-[#3c3c3c] p-2">
            <div className="text-[#cccccc] text-xs font-medium mb-2 px-2">Files</div>
            <div className="space-y-0.5">
              {files.map((file, idx) => (
                <div key={idx} className="text-xs text-[#cccccc] hover:bg-[#2a2d2e] px-2 py-1 rounded cursor-pointer truncate">
                  📄 {file}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#2d2d30] border-b border-[#3c3c3c] px-4 py-2">
            <div className="inline-flex items-center bg-[#1e1e1e] px-3 py-1 rounded-t text-xs text-[#cccccc] border-t-2 border-[#0078d4]">
              📄 {filename}
              <span className="ml-2 text-[#858585]">×</span>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Line Numbers */}
            <div className="bg-[#1e1e1e] px-3 py-3 text-[#858585] text-sm font-mono border-r border-[#3c3c3c] min-w-[40px] text-right">
              {linesToShow.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Content */}
            <div className="flex-1 p-3 font-mono text-sm overflow-auto">
              <Highlight code={typedCode || ""} language="javascript" theme={vsCodeDark}>
                {({ style, tokens, getLineProps, getTokenProps }) => (
                  <pre style={{ ...style, background: "transparent", margin: 0 }}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })} className="leading-6">
                        {line.map((token, key) => {
                        const safeToken = { ...token, content: token.content || "" }; // fallback to empty string
                        return <span key={key} {...getTokenProps({ token: safeToken })} />;
                      })}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <motion.div
        className="bg-[#42a5f5] text-white text-xs px-4 py-2.5 flex items-center justify-between border-t border-[#1976d2] relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        whileHover={{ backgroundColor: "#1976d2" }}
      >
        <div className="flex items-center gap-6">
          <motion.span
            className="font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            {caption}
          </motion.span>
          {hovered && (
            <motion.span
              className="text-[#e3f2fd] opacity-90"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              ⌘K to ask AI
            </motion.span>
          )}
        </div>
        <motion.div
          className="flex items-center gap-4 text-[#e3f2fd] opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        >
          <span>JavaScript</span>
          <span>UTF-8</span>
          <span>LF</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
