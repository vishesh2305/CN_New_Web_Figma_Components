"use client";

import { useState, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { motion } from "framer-motion";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";


const codeSteps = [
  `function Welcome() {`,
  `\n  return <h1>Hello, World!</h1>;`,
  `\n}`,
  `\n}`,
  `\n}`,
  `\n}`,
  `\n}`,
];


const formatCode = (code: string) => {
  try {
    return prettier.format(code, {
      parser: "babel",
      plugins: [parserBabel],
    });
  } catch {
    return code;
  }
};



export default function FlowBlock() {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedCode, setDisplayedCode] = useState(codeSteps[0]);
  const [isTyping, setIsTyping] = useState(false);

  // Only show ghost text AFTER a line has been fully typed
  const ghostText =
    !isTyping && currentStep < codeSteps.length - 1
      ? codeSteps[currentStep + 1]
      : "";

  // Tab press handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Tab" &&
        !isTyping &&
        currentStep < codeSteps.length - 1
      ) {
        event.preventDefault();
        setIsTyping(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, isTyping]);

  // Typing effect for each step
  useEffect(() => {
    if (isTyping) {
      const nextStepIndex = currentStep + 1;
      const codeToType = codeSteps[nextStepIndex];
      const initialCode = displayedCode;
      let i = 0;

      const intervalId = setInterval(() => {
        setDisplayedCode(initialCode + codeToType.substring(0, i));
        i++;
        if (i > codeToType.length) {
          clearInterval(intervalId);
          setCurrentStep(nextStepIndex);
          setIsTyping(false);
        }
      }, 50);

      return () => clearInterval(intervalId);
    }
  }, [isTyping]);

  const handleEditorDidMount: OnMount = (_editor, monaco) => {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e",
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl h-[250px] bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-800 overflow-hidden relative"
    >
      {/* Monaco Editor (hidden but used for layout/scroll/syntax font) */}
      <Editor
        height="100%"
        language="javascript"
        theme="custom-dark"
        value={displayedCode}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollbar: { vertical: "hidden" },
          fontSize: 18,
          readOnly: true,
          wordWrap: "on",
          lineNumbers: "off",
          renderLineHighlight: "none",
        }}
        className="opacity-0"
      />

      {/* Overlay with real code + ghost preview */}
      <div className="absolute inset-0 p-3 font-mono text-[18px] whitespace-pre-wrap leading-snug overflow-auto text-white">
        <span>{displayedCode}</span>
        {ghostText && (
          <span className="text-gray-500 opacity-50">{ghostText}</span>
        )}
      </div>
    </motion.div>
  );
}