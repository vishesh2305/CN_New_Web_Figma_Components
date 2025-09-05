"use client";

import React, { useEffect, useRef } from "react";

const Fifteenthascii: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 65;
    const height = 65;

    let grid: string[][] = [];
    let time = 0;
    let animationFrameId: number;

    const initGrid = () => {
      grid = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => " ")
      );
    };

    const render = () => {
      if (!canvas) return;
      let html = "";
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          html += grid[y][x];
        }
        html += "<br>";
      }
      canvas.innerHTML = html;
    };

    const update = () => {
      initGrid();

      const t = time * 0.006;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const centerX = width / 2;
          const centerY = height / 2;
          
          const manhattanDist = Math.abs(x - centerX) + Math.abs(y - centerY);
          
          const wave1 = Math.sin(manhattanDist * 0.4 - t * 3);
          const wave2 = Math.cos(manhattanDist * 0.2 - t * 1.5);
          
          const interference = wave1 + wave2;
          
          if (interference > 1.2) {
            grid[y][x] = "1";
          } else if (interference < -1.2) {
            grid[y][x] = "0";
          } else if (Math.abs(interference) < 0.3) {
            grid[y][x] = "#";
          }
        }
      }

      for (let i = 0; i < width + height; i++) {
        const offset = Math.floor(Math.sin(t + i * 0.1) * 3);
        
        let x1 = i + offset;
        let y1 = 0;
        while (x1 >= 0 && x1 < width && y1 < height) {
          if (Math.floor(time / 10) % 3 === 0) {
            grid[y1][x1] = "1";
          }
          x1--;
          y1++;
        }
        
        let x2 = width - 1 - i + offset;
        let y2 = 0;
        while (x2 >= 0 && x2 < width && y2 < height) {
          if (Math.floor(time / 10) % 3 === 1) {
            grid[y2][x2] = "0";
          }
          x2++;
          y2++;
        }
      }

      time++;
    };

    const animate = () => {
      update();
      render();
      animationFrameId = requestAnimationFrame(animate);
    };

    initGrid();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (canvas) canvas.innerHTML = "";
      grid = [];
      time = 0;
    };
  }, []);

  return (
    <div
      style={{
        margin: "50px auto", 
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "600px", 
        width: "600px",  
        borderRadius: "10px", 
      }}
    >
      <div
        style={{
          padding: "20px",
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={canvasRef}
          style={{
            lineHeight: "0.85",
            letterSpacing: "0.05em",
            color: "#ffffff", 
            userSelect: "none",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        />
      </div>
    </div>
  );
};

export default Fifteenthascii;