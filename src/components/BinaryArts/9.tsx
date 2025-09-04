import React, { useState, useEffect, useCallback, useRef } from "react";


interface Position {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Line {
  path: string;
  opacity: number;
}

const Nineascii: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 600,
    height: 600,
  });
  const { width, height } = dimensions;

  const radius = Math.min(width, height) * 0.267; 
  const lineCount = 400; 

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: width / 2,
    y: height / 2,
  });
  const [circlePositions, setCirclePositions] = useState<Position[] | null>(
    null
  );
  const [centerRotation, setCenterRotation] = useState<number>(0);

  const animationRef = useRef<number | null>(null);
  const easingFactor = 0.08; 
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        setMousePos({ x: rect.width / 2, y: rect.height / 2 });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const initialPositions: Position[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distanceFromCenter = radius * 0.5;
      const x = width / 2 + Math.cos(angle) * distanceFromCenter;
      const y = height / 2 + Math.sin(angle) * distanceFromCenter;
      initialPositions.push({ x, y, targetX: x, targetY: y });
    }
    initialPositions.push({
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    });

    setCirclePositions(initialPositions);
  }, [width, height, radius]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePos({ x, y });
    },
    []
  );

  useEffect(() => {
    setCirclePositions((prevPositions) => {
      if (!prevPositions) return null;

      let closestCircleIndex = 0;
      let minDistance = Infinity;

      prevPositions.forEach((circle, i) => {
        const dx = mousePos.x - circle.x;
        const dy = mousePos.y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
          closestCircleIndex = i;
        }
      });

      return prevPositions.map((circle, i) => {
        let baseCx: number, baseCy: number;
        if (i === 8) {
          baseCx = width / 2;
          baseCy = height / 2;
        } else {
          const angle = (i / 8) * Math.PI * 2;
          const distanceFromCenter = radius * 0.5;
          baseCx = width / 2 + Math.cos(angle) * distanceFromCenter;
          baseCy = height / 2 + Math.sin(angle) * distanceFromCenter;
        }

        if (i === closestCircleIndex) {
          const maxMovement = radius * 0.1;
          const dx = mousePos.x - baseCx;
          const dy = mousePos.y - baseCy;
          const movement =
            Math.min(Math.sqrt(dx * dx + dy * dy) / radius, 1) * maxMovement;
          const moveAngle = Math.atan2(dy, dx);

          return {
            ...circle,
            targetX: baseCx + Math.cos(moveAngle) * movement,
            targetY: baseCy + Math.sin(moveAngle) * movement,
          };
        } else {
          return {
            ...circle,
            targetX: baseCx,
            targetY: baseCy,
          };
        }
      });
    });
  }, [mousePos, width, height, radius]);

  useEffect(() => {
    const animate = () => {
      setCenterRotation((prev) => prev + 0.005);

      setCirclePositions((prevPositions) => {
        if (!prevPositions) return null;

        return prevPositions.map((circle) => {
          const dx = circle.targetX - circle.x;
          const dy = circle.targetY - circle.y;

          return {
            ...circle,
            x: circle.x + dx * easingFactor,
            y: circle.y + dy * easingFactor,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [easingFactor]);

  const generatePetalLines = (
    cx: number,
    cy: number,
    radius: number,
    rotation = 0,
    isCenter = false
  ): Line[] => {
    const lines: Line[] = [];
    const petalCount = 12;

    for (let petal = 0; petal < petalCount; petal++) {
      const petalAngle = (petal / petalCount) * Math.PI * 2 + rotation;
      const linesPerPetal = Math.floor(lineCount / petalCount);

      for (let i = 0; i < linesPerPetal; i++) {
        const t = i / linesPerPetal;
        const angle = petalAngle + (t - 0.5) * 0.5;

        const innerRadius = isCenter ? radius * 0.1 : radius * 0.2;
        const outerRadius =
          radius * (0.9 - Math.pow(Math.abs(t - 0.5) * 2, 2) * 0.3);

        const curveOffset = Math.sin(t * Math.PI) * 0.1;
        const curvedAngle = angle + curveOffset;

        const x1 = cx + Math.cos(curvedAngle) * innerRadius;
        const y1 = cy + Math.sin(curvedAngle) * innerRadius;
        const x2 = cx + Math.cos(angle) * outerRadius;
        const y2 = cy + Math.sin(angle) * outerRadius;

        lines.push({
          path: `M${x1},${y1} L${x2},${y2}`,
          opacity: 0.6 - Math.abs(t - 0.5) * 0.4,
        });
      }
    }

    return lines;
  };

  if (!circlePositions) return null;

  return (
    <div
      ref={containerRef}
    style={{
    margin: "50px auto",
    background: "#FFFFFF",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "600px",
    width: "600px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
      >
        {circlePositions.map((circle, index) => (
          <g key={index}>
            {generatePetalLines(
              circle.x,
              circle.y,
              index === 8 ? radius * 0.7 : radius,
              index === 8 ? centerRotation : (index / 8) * Math.PI * 2,
              index === 8
            ).map((line, i) => (
              <path
                key={i}
                d={line.path}
                stroke="#333333"
                strokeWidth={index === 8 ? 0.4 : 0.3}
                opacity={line.opacity}
                fill="none"
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Nineascii;
