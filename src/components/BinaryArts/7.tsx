"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Seventhascii: React.FC = () => {
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

    const createSatelliteDish = (): THREE.Group => {
      const group = new THREE.Group();

      const dishGeometry = new THREE.BufferGeometry();
      const dishVertices: number[] = [];
      const rings = 12;
      const segments = 16;
      const radius = 6;

      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segments; s++) {
          const currentRadius = (r / rings) * radius;
          const nextRadius = ((r + 1) / rings) * radius;
          const angle1 = (s / segments) * Math.PI * 2;
          const angle2 = ((s + 1) / segments) * Math.PI * 2;

          const y1 = -currentRadius * currentRadius * 0.1;
          const y2 = -nextRadius * nextRadius * 0.1;

          if (r < rings - 1) {
            dishVertices.push(
              Math.cos(angle1) * currentRadius, y1, Math.sin(angle1) * currentRadius,
              Math.cos(angle1) * nextRadius, y2, Math.sin(angle1) * nextRadius
            );
          }

          dishVertices.push(
            Math.cos(angle1) * currentRadius, y1, Math.sin(angle1) * currentRadius,
            Math.cos(angle2) * currentRadius, y1, Math.sin(angle2) * currentRadius
          );
        }
      }

      dishGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dishVertices, 3));
      group.add(new THREE.LineSegments(dishGeometry, material));

      const armGeometry = new THREE.BufferGeometry();
      const armVertices: number[] = [];
      armVertices.push(
        0, 0, 0, 0, -2, -4,
        0, -2, -4, -0.5, -2, -4,
        0, -2, -4, 0.5, -2, -4
      );
      armGeometry.setAttribute('position', new THREE.Float32BufferAttribute(armVertices, 3));
      group.add(new THREE.LineSegments(armGeometry, material));

      const lnbGeometry = new THREE.BufferGeometry();
      const lnbVertices: number[] = [];
      const lnbSize = 0.3;
      lnbVertices.push(
        -lnbSize, -2, -4 - lnbSize, lnbSize, -2, -4 - lnbSize,
        lnbSize, -2, -4 - lnbSize, lnbSize, -2, -4 + lnbSize,
        lnbSize, -2, -4 + lnbSize, -lnbSize, -2, -4 + lnbSize,
        -lnbSize, -2, -4 + lnbSize, -lnbSize, -2, -4 - lnbSize,

        -lnbSize, -2 - lnbSize, -4 - lnbSize, lnbSize, -2 - lnbSize, -4 - lnbSize,
        lnbSize, -2 - lnbSize, -4 - lnbSize, lnbSize, -2 - lnbSize, -4 + lnbSize,
        lnbSize, -2 - lnbSize, -4 + lnbSize, -lnbSize, -2 - lnbSize, -4 + lnbSize,
        -lnbSize, -2 - lnbSize, -4 + lnbSize, -lnbSize, -2 - lnbSize, -4 - lnbSize,

        -lnbSize, -2, -4 - lnbSize, -lnbSize, -2 - lnbSize, -4 - lnbSize,
        lnbSize, -2, -4 - lnbSize, lnbSize, -2 - lnbSize, -4 - lnbSize,
        lnbSize, -2, -4 + lnbSize, lnbSize, -2 - lnbSize, -4 + lnbSize,
        -lnbSize, -2, -4 + lnbSize, -lnbSize, -2 - lnbSize, -4 + lnbSize
      );
      lnbGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lnbVertices, 3));
      group.add(new THREE.LineSegments(lnbGeometry, material));

      const poleGeometry = new THREE.BufferGeometry();
      const poleVertices: number[] = [];
      poleVertices.push(0, 0, 0, 0, -8, 0);

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const nextAngle = ((i + 1) / 8) * Math.PI * 2;
        poleVertices.push(
          Math.cos(angle) * 2, -8, Math.sin(angle) * 2,
          Math.cos(nextAngle) * 2, -8, Math.sin(nextAngle) * 2,
          0, -8, 0,
          Math.cos(angle) * 2, -8, Math.sin(angle) * 2
        );
      }

      poleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(poleVertices, 3));
      group.add(new THREE.LineSegments(poleGeometry, material));

      return group;
    };

    const satelliteDish = createSatelliteDish();
    scene.add(satelliteDish);

    camera.position.set(12, 5, 12);
    camera.lookAt(0, -2, 0);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      satelliteDish.rotation.y += 0.002;
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

export default Seventhascii;
