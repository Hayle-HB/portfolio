import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const FloatingCrystal = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    // Set size
    const container = mountRef.current;
    const size = Math.max(container.clientWidth, container.clientHeight);
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create crystal geometry
    const geometry = new THREE.OctahedronGeometry(2, 0);

    // Create crystal material with refraction and iridescence
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      iridescence: 0.3,
      iridescenceIOR: 1.5,
      sheen: 1,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color(0x88ccff),
    });

    // Create crystal mesh
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff7777, 1, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7777ff, 1, 20);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Camera position
    camera.position.z = 6;

    // Mouse movement variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    // Handle mouse movement
    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / size) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / size) * 2 + 1;

      targetRotationX = mouseY * 0.5;
      targetRotationY = mouseX * 0.5;
    };

    // Base animation properties
    let time = 0;
    const baseY = crystal.position.y;
    const floatAmplitude = 0.2;
    const floatSpeed = 0.02;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Smooth rotation towards mouse position
      crystal.rotation.x += (targetRotationX - crystal.rotation.x) * 0.1;
      crystal.rotation.y += (targetRotationY - crystal.rotation.y) * 0.1;

      // Floating animation
      crystal.position.y = baseY + Math.sin(time * floatSpeed) * floatAmplitude;

      // Continuous gentle rotation
      crystal.rotation.z += 0.005;

      // Move lights in circular pattern
      pointLight1.position.x = Math.sin(time) * 5;
      pointLight1.position.z = Math.cos(time) * 5;
      pointLight2.position.x = Math.sin(time + Math.PI) * 5;
      pointLight2.position.z = Math.cos(time + Math.PI) * 5;

      renderer.render(scene, camera);
    };
    animate();

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      const newSize = Math.max(container.clientWidth, container.clientHeight);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(newSize, newSize);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{
        transform: "scale(1.25)",
        transformOrigin: "center center",
      }}
    />
  );
};

export default FloatingCrystal;
