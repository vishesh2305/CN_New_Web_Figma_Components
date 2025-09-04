"use client";

import React, { useRef, useEffect } from "react";

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Vertex {
  position: Vector3;
  normal: Vector3;
  tangent1: Vector3;
  tangent2: Vector3;
  theta: number;
  phi: number;
  hatchingIntensity: number;
}

interface ProjectedVertex {
  x: number;
  y: number;
  z: number;
  vertex: Vertex;
}

const Seventhascii: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#F0EEE6";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    let time = 50;
    const timeStep = 0.004;

    const baseForm = {
      majorRadius: 80,
      minorRadius: 30,
      complexity: 0.8,
      resolution: 36,
    };

    let cachedVertices: Vertex[] | null = null;
    let lastCacheTime = -1;
    const cacheLifetime = 0.1;

    const noise3D = (x: number, y: number, z: number, t: number): number => {
      return (
        Math.sin(x * 0.1 + t * 0.15) *
        Math.cos(y * 0.1 + Math.sin(z * 0.1) + t * 0.1) *
        Math.sin(z * 0.1 + Math.sin(x * 0.1) + t * 0.2)
      );
    };

    const generateVertices = (time: number): Vertex[] => {
      if (cachedVertices && time - lastCacheTime < cacheLifetime) {
        return cachedVertices;
      }

      const vertices: Vertex[] = [];
      const resolution = baseForm.resolution;
      const breathingFactor = Math.sin(time * 0.2) * 5;
      const majorRadius = baseForm.majorRadius + breathingFactor;
      const minorRadius = baseForm.minorRadius + breathingFactor * 0.2;

      for (let i = 0; i < resolution; i++) {
        const theta = (i / resolution) * Math.PI * 2;

        for (let j = 0; j < resolution; j++) {
          const phi = (j / resolution) * Math.PI * 2;

          const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
          const y = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
          const z = minorRadius * Math.sin(phi);

          const noiseScale = 0.02 * baseForm.complexity;
          const timeFactor = time * 0.2;
          const noise =
            15 * noise3D(x * noiseScale, y * noiseScale, z * noiseScale, timeFactor) +
            7 * noise3D(x * noiseScale * 2, y * noiseScale * 2, z * noiseScale * 2, timeFactor * 1.3);

          const normalX = x / majorRadius;
          const normalY = y / majorRadius;
          const normalZ = z / minorRadius;
          const normalLength = Math.sqrt(normalX ** 2 + normalY ** 2 + normalZ ** 2) || 0.001;

          const deformedX = x + (normalX / normalLength) * noise;
          const deformedY = y + (normalY / normalLength) * noise;
          const deformedZ = z + (normalZ / normalLength) * noise;

          const tangent1X = -Math.sin(theta);
          const tangent1Y = Math.cos(theta);
          const tangent1Z = 0;

          const tangent2X = -Math.cos(theta) * Math.sin(phi);
          const tangent2Y = -Math.sin(theta) * Math.sin(phi);
          const tangent2Z = Math.cos(phi);

          vertices.push({
            position: { x: deformedX, y: deformedY, z: deformedZ },
            normal: { x: normalX / normalLength, y: normalY / normalLength, z: normalZ / normalLength },
            tangent1: { x: tangent1X, y: tangent1Y, z: tangent1Z },
            tangent2: { x: tangent2X, y: tangent2Y, z: tangent2Z },
            theta,
            phi,
            hatchingIntensity:
              0.3 + 0.7 * Math.abs(noise3D(deformedX * 0.03, deformedY * 0.03, deformedZ * 0.03, time * 0.5)),
          });
        }
      }

      cachedVertices = vertices;
      lastCacheTime = time;
      return vertices;
    };

    const project = (point: Vector3, time: number) => {
      const rotX = time * 0.05;
      const rotY = time * 0.075;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const y1 = point.y;
      const z1 = point.z * cosX - point.x * sinX;
      const x1 = point.z * sinX + point.x * cosX;

      const y2 = y1 * cosY - z1 * sinY;
      const z2 = y1 * sinY + z1 * cosY;
      const x2 = x1;

      const scale = 1.5;
      return { x: centerX + x2 * scale, y: centerY + y2 * scale, z: z2 };
    };

    const calculateVisibility = (projectedVertices: ProjectedVertex[]) => {
      const bufferSize = 200;
      const zBuffer = Array.from({ length: bufferSize }, () => Array(bufferSize).fill(-Infinity));
      const visible = new Array(projectedVertices.length).fill(false);

      const toBufferCoords = (x: number, y: number) => ({
        bx: Math.floor((x / width) * bufferSize),
        by: Math.floor((y / height) * bufferSize),
      });

      projectedVertices.forEach((vertex, index) => {
        const { bx, by } = toBufferCoords(vertex.x, vertex.y);
        if (bx >= 0 && bx < bufferSize && by >= 0 && by < bufferSize) {
          if (vertex.z > zBuffer[by][bx]) {
            zBuffer[by][bx] = vertex.z;
            visible[index] = true;
          }
        }
      });

      return visible;
    };

    const generateHatchingLines = (vertices: Vertex[], time: number) => {
      const projectedVertices: ProjectedVertex[] = vertices.map((v) => {
        const projection = project(v.position, time);
        return { ...projection, vertex: v };
      });

      const isVisible = calculateVisibility(projectedVertices);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      projectedVertices.forEach((p, i) => {
        if (!isVisible[i]) return;

        const intensity = p.vertex.hatchingIntensity;
        ctx.strokeStyle = `rgba(0,0,0,${intensity})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vertex.tangent1.x * 5, p.y + p.vertex.tangent1.y * 5);
        ctx.stroke();
      });
    };

    const animate = () => {
      time += timeStep;
      const vertices = generateVertices(time);
      generateHatchingLines(vertices, time);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      ctx.clearRect(0, 0, width, height);
      cachedVertices = null;
    };
  }, []);

  return (
    <div
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
        position: "relative",
      }}
    >
      <canvas ref={canvasRef} width={550} height={550} />
    </div>
  );
};

export default Seventhascii;