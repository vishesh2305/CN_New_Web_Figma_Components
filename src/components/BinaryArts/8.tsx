"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Eighthascii: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    // Scene + Camera + Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(dpr, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0x404040));
    const dirLight = new THREE.DirectionalLight(0x808080, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Line Material
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65,
    });

    /**
     * Create Antenna Tower
     */
    const createTower = () => {
      const group = new THREE.Group();

      // Base pole
      const baseGeometry = new THREE.BufferGeometry();
      const baseVertices: number[] = [];
      baseVertices.push(0, 0, 0, 0, 12, 0);
      baseGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(baseVertices, 3)
      );
      group.add(new THREE.LineSegments(baseGeometry, lineMaterial));

      // Tower rings
      const ringCount = 8;
      const segments = 24;
      for (let i = 0; i < ringCount; i++) {
        const y = (i / ringCount) * 12;
        const radius = 2 - i * 0.15;

        const ringGeometry = new THREE.BufferGeometry();
        const ringVertices: number[] = [];

        for (let s = 0; s < segments; s++) {
          const angle1 = (s / segments) * Math.PI * 2;
          const angle2 = ((s + 1) / segments) * Math.PI * 2;
          ringVertices.push(
            Math.cos(angle1) * radius,
            y,
            Math.sin(angle1) * radius,
            Math.cos(angle2) * radius,
            y,
            Math.sin(angle2) * radius
          );
        }

        ringGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(ringVertices, 3)
        );
        group.add(new THREE.LineSegments(ringGeometry, lineMaterial));
      }

      // Antenna dish-like head
      const headGeometry = new THREE.BufferGeometry();
      const headVertices: number[] = [];
      const headRadius = 2.5;
      const headSegments = 20;

      for (let s = 0; s < headSegments; s++) {
        const angle = (s / headSegments) * Math.PI * 2;
        headVertices.push(
          0,
          12,
          0,
          Math.cos(angle) * headRadius,
          12.5,
          Math.sin(angle) * headRadius
        );
      }
      headGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(headVertices, 3)
      );
      group.add(new THREE.LineSegments(headGeometry, lineMaterial));

      return group;
    };

    const tower = createTower();
    scene.add(tower);

    // Camera Position
    camera.position.set(10, 8, 15);
    camera.lookAt(0, 6, 0);

    // Animation
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      tower.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        if ((obj as THREE.Mesh).material) {
          const mat = (obj as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        margin: "50px auto",
        background: "#ffffff",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "550px",
        width: "550px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    />
  );
};

export default Eighthascii;
