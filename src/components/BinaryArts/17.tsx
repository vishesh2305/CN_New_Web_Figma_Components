"use client";

import React, { useEffect, useRef } from "react";

const Seventeenthascii: React.FC = () => {
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

      const t = time * 0.009;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = Math.abs(x - centerX);
          const dy = Math.abs(y - centerY);
          
          const squareDist = Math.max(dx, dy);
          
          const wave1 = Math.sin(squareDist * 0.5 - t * 2.5);
          const wave2 = Math.cos(squareDist * 0.3 - t * 1.8);
          const noise = Math.sin(x * 0.2 + y * 0.15 + t) * 0.3;
          
          const combined = wave1 + wave2 + noise;
          
          if (combined > 1.0) {
            grid[y][x] = "1";
          } else if (combined < -1.0) {
            grid[y][x] = "0";
          } else if (Math.abs(combined) < 0.2) {
            grid[y][x] = "+";
          }
        }
      }

      for (let p = 0; p < 8; p++) {
        const angle = (p / 8) * Math.PI * 2 + t * 0.3;
        const radius = 15 + Math.sin(t + p) * 8;
        
        const px = Math.floor(centerX + Math.cos(angle) * radius);
        const py = Math.floor(centerY + Math.sin(angle) * radius);
        
        if (px >= 0 && px < width && py >= 0 && py < height) {
          grid[py][px] = "*";
          
          for (let trail = 1; trail < 4; trail++) {
            const trailAngle = angle - trail * 0.1;
            const trailRadius = radius - trail * 2;
            const tx = Math.floor(centerX + Math.cos(trailAngle) * trailRadius);
            const ty = Math.floor(centerY + Math.sin(trailAngle) * trailRadius);
            
            if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
              grid[ty][tx] = trail === 3 ? "." : "°";
            }
          }
        }
      }

      const borderPulse = Math.floor((Math.sin(t * 1.2) + 1) * 3);
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < borderPulse; j++) {
          if (j < height) grid[j][i] = i % 3 === 0 ? "^" : "▲";
          if (height - 1 - j >= 0) grid[height - 1 - j][i] = i % 3 === 0 ? "v" : "▼";
        }
      }
      
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < borderPulse; j++) {
          if (j < width) grid[i][j] = i % 3 === 0 ? "<" : "◄";
          if (width - 1 - j >= 0) grid[i][width - 1 - j] = i % 3 === 0 ? ">" : "►";
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

export default Seventeenthascii;