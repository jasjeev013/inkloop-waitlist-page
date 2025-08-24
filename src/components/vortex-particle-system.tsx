"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const VortexParticleSystemExact: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(550, 550);
    renderer.setClearColor(0xf0eee6, 1);

    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    camera.position.z = 7;

    // Create particles
    const particleCount = 25000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const indices = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const t = Math.random();
      const angle = t * Math.PI * 20;

      const radius = 0.6 + t * 2.2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (t - 0.5) * 5;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      sizes[i] = 0.03 + 0.04 * Math.random();
      opacities[i] = 0.4 + 0.6 * Math.random();
      indices[i] = i;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    particles.setAttribute("index", new THREE.BufferAttribute(indices, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x333333) },
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute float index;
        uniform float time;
        varying float vOpacity;

        void main() {
          vOpacity = opacity;
          vec3 pos = position;

          float i = index;
          float speed = 0.2 + 0.2 * fract(i / 1000.0);
          float angle = time * speed + i * 0.001;

          float twistAmount = sin(time * 0.3) * 0.5;
          float twist = pos.y * twistAmount;

          float r = length(pos.xy);
          float breathe = 1.0 + sin(time * 0.5) * 0.1;
          r *= breathe;

          float theta = atan(pos.y, pos.x) + twist;
          pos.x = r * cos(theta);
          pos.y = r * sin(theta);

          pos.z += sin(time * 0.2 + i * 0.01) * 0.2;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (50.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;

        void main() {
          if (length(gl_PointCoord - vec2(0.5)) > 0.475) discard;
          gl_FragColor = vec4(color, vOpacity);
        }
      `,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    let animationId: number | null = null;
    const clock = new THREE.Clock(); // ensures smooth `time`

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      particleMaterial.uniforms.time.value = elapsedTime;

      camera.position.x = Math.sin(elapsedTime * 0.1) * 1.5;
      camera.position.y = Math.cos(elapsedTime * 0.15) * 1.0;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);

      scene.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m:any) => m.dispose());
          } else child.material.dispose();
        }
      });

      if (canvasRef.current?.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center bg-[#F0EEE6]">
      <div ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default VortexParticleSystemExact;
