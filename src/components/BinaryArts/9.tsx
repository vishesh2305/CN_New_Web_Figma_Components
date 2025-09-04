"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Nineascii: React.FC = () => {
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

    const createServerRack = (): THREE.LineSegments => {
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const rackWidth = 6;
      const rackHeight = 12;
      const rackDepth = 4;
      const unitHeight = 1.5;

      vertices.push(
        -rackWidth/2, 0, -rackDepth/2, rackWidth/2, 0, -rackDepth/2,
        rackWidth/2, 0, -rackDepth/2, rackWidth/2, 0, rackDepth/2,
        rackWidth/2, 0, rackDepth/2, -rackWidth/2, 0, rackDepth/2,
        -rackWidth/2, 0, rackDepth/2, -rackWidth/2, 0, -rackDepth/2,

        -rackWidth/2, rackHeight, -rackDepth/2, rackWidth/2, rackHeight, -rackDepth/2,
        rackWidth/2, rackHeight, -rackDepth/2, rackWidth/2, rackHeight, rackDepth/2,
        rackWidth/2, rackHeight, rackDepth/2, -rackWidth/2, rackHeight, rackDepth/2,
        -rackWidth/2, rackHeight, rackDepth/2, -rackWidth/2, rackHeight, -rackDepth/2,

        -rackWidth/2, 0, -rackDepth/2, -rackWidth/2, rackHeight, -rackDepth/2,
        rackWidth/2, 0, -rackDepth/2, rackWidth/2, rackHeight, -rackDepth/2,
        rackWidth/2, 0, rackDepth/2, rackWidth/2, rackHeight, rackDepth/2,
        -rackWidth/2, 0, rackDepth/2, -rackWidth/2, rackHeight, rackDepth/2
      );

      for (let i = 1; i < 8; i++) {
        const y = i * unitHeight;
        vertices.push(
          -rackWidth/2 + 0.5, y, -rackDepth/2, rackWidth/2 - 0.5, y, -rackDepth/2,
          rackWidth/2 - 0.5, y, -rackDepth/2, rackWidth/2 - 0.5, y, rackDepth/2 - 1,
          rackWidth/2 - 0.5, y, rackDepth/2 - 1, -rackWidth/2 + 0.5, y, rackDepth/2 - 1,
          -rackWidth/2 + 0.5, y, rackDepth/2 - 1, -rackWidth/2 + 0.5, y, -rackDepth/2
        );

        for (let j = 0; j < 4; j++) {
          const x = -2 + j * 1;
          vertices.push(x, y + 0.3, -rackDepth/2 - 0.1, x + 0.2, y + 0.3, -rackDepth/2 - 0.1);
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    const serverRack = createServerRack();
    scene.add(serverRack);

    camera.position.set(10, 8, 12);
    camera.lookAt(0, 6, 0);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      serverRack.rotation.y += 0.003;
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

export default Nineascii;
