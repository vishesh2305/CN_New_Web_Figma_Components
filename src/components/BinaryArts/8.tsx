"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Eightascii: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(Math.min(dpr, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0x808080, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight, directionalLight);

    const material = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 });

    const createCPU = (): THREE.Group => {
      const group = new THREE.Group();

      const baseGeometry = new THREE.BufferGeometry();
      const baseVertices: number[] = [];
      const size = 4;
      const height = 0.5;

      baseVertices.push(
        -size, 0, -size, size, 0, -size,
        size, 0, -size, size, 0, size,
        size, 0, size, -size, 0, size,
        -size, 0, size, -size, 0, -size,
        -size, 0, -size, -size, height, -size,
        size, 0, -size, size, height, -size,
        size, 0, size, size, height, size,
        -size, 0, size, -size, height, size,
        -size, height, -size, size, height, -size,
        size, height, -size, size, height, size,
        size, height, size, -size, height, size,
        -size, height, size, -size, height, -size
      );

      for (let x = -3; x <= 3; x += 0.8) {
        for (let z = -3; z <= 3; z += 0.8) {
          baseVertices.push(x, 0, z, x, -0.3, z);
        }
      }

      baseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(baseVertices, 3));
      group.add(new THREE.LineSegments(baseGeometry, material));

      for (let i = 0; i < 8; i++) {
        const finGeometry = new THREE.BufferGeometry();
        const finVertices: number[] = [];
        const x = -3 + i * 0.8;
        const finHeight = 3;

        finVertices.push(
          x, height, -size, x, height + finHeight, -size,
          x, height + finHeight, -size, x, height + finHeight, size,
          x, height + finHeight, size, x, height, size,
          x, height, size, x, height, -size
        );

        finGeometry.setAttribute('position', new THREE.Float32BufferAttribute(finVertices, 3));
        group.add(new THREE.LineSegments(finGeometry, material));
      }

      return group;
    };

    const cpu = createCPU();
    scene.add(cpu);

    camera.position.set(8, 6, 10);
    camera.lookAt(0, 1, 0);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      cpu.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if ((object as THREE.Mesh).geometry) (object as THREE.Mesh).geometry.dispose();
        if ((object as THREE.Mesh).material) {
          const mat = (object as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else mat.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        margin: 0,
        background: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '550px',
        width: '550px',
        position: 'relative',
      }}
    />
  );
};

export default Eightascii;
