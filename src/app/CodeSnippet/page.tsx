import CodeBox from "../../components/codesnippet/CodeBox";
import Fourteenthascii from "@/components/BinaryArts/14";
import Fifteenthascii from "@/components/BinaryArts/15";
import Sixteenthascii from "@/components/BinaryArts/16";
import Seventeenthascii from "@/components/BinaryArts/17";

export default function Code() {
    // const asciiArtComponents = [Fourteenthascii, Fifteenthascii, Sixteenthascii, Seventeenthascii];
  const codeSnippets = [
    {
      title: "Binary Storm",
      filename: "binarystorm.js",
      code: `
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

      const centerX = width / 2;
      const centerY = height / 2;
      const t = time * 0.008;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          const spiral = Math.sin(dist * 0.3 - t * 2 + angle * 3);
          const pulse = Math.sin(dist * 0.15 - t);
          
          if (spiral + pulse > 0.3) {
            grid[y][x] = "1";
          } else if (spiral + pulse < -0.3) {
            grid[y][x] = "0";
          } else {
            grid[y][x] = Math.random() > 0.7 ? "." : " ";
          }
        }
      }

      for (let arm = 0; arm < 4; arm++) {
        const armAngle = (arm * Math.PI / 2) + t;
        for (let r = 5; r < 25; r++) {
          const x = Math.floor(centerX + Math.cos(armAngle) * r);
          const y = Math.floor(centerY + Math.sin(armAngle) * r);
          if (x >= 0 && x < width && y >= 0 && y < height) {
            grid[y][x] = r % 3 === 0 ? "1" : "0";
          }
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
            color: "#FFFFFF", 
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

export default Fourteenthascii;`,
      caption: "Matrix-style Sea Storm code.",
      files: [],
    },
    {
      title: "Binary Maze",
      filename: "binarymaze.js",
      code: `
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

export default Fifteenthascii;`,
      caption: "Real-time binary Maze using JavaScript.",
      files: [],
    },
    {
      title: "Binary Execution",
      filename: "binaryexecution.js",
      code: `
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

      const t = time * 0.007;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          
          const hexX = dx * 0.866 - dy * 0.5;
          const hexY = dy;
          
          const cellX = Math.floor(hexX / 8);
          const cellY = Math.floor(hexY / 8);
          
          const cellPhase = (cellX + cellY * 1.618 + t) * 2;
          const cellValue = Math.sin(cellPhase);
          
          const localX = hexX - cellX * 8;
          const localY = hexY - cellY * 8;
          const localDist = Math.sqrt(localX * localX + localY * localY);
          
          const breathing = Math.sin(t * 0.5 + cellX + cellY) * 2 + 3;
          
          if (localDist < breathing && cellValue > 0) {
            grid[y][x] = "1";
          } else if (localDist < breathing && cellValue <= 0) {
            grid[y][x] = "0";
          } else if (localDist < breathing + 1) {
            grid[y][x] = Math.random() > 0.8 ? "." : " ";
          }
        }
      }

      const scanLine = Math.floor((Math.sin(t * 0.8) + 1) * height / 2);
      for (let x = 0; x < width; x++) {
        if (scanLine >= 0 && scanLine < height) {
          grid[scanLine][x] = x % 2 === 0 ? "=" : "-";
        }
      }

      const pulseX = Math.floor((Math.cos(t * 0.6) + 1) * width / 2);
      for (let y = 0; y < height; y++) {
        if (pulseX >= 0 && pulseX < width) {
          grid[y][pulseX] = y % 2 === 0 ? "|" : "!";
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

export default Sixteenthascii;`,
      caption: "Animated ececution binary art.",
      files: [],
    },
    {
      title: "Interactive Binary Infinite Loop",
      filename: "binaryloop.js",
      code: `
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

export default Seventeenthascii;`,
      caption: "Interactive binary loop with mouse hover effects.",
      files: [],
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#42a5f5] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1976d2] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-[1400px] mx-auto h-[calc(100vh-2rem)] relative z-10">
{codeSnippets.map((snippet, i) => (
  <CodeBox
    key={i}
    title={snippet.title}
    filename={snippet.filename}
    code={snippet.code}
    caption={snippet.caption}
    files={snippet.files}
    hoverText="Hovering over code!"
    // AsciiArtComponent={asciiArtComponents[i % asciiArtComponents.length]} 
  />
))}
      </div>
    </main>
  );
}
