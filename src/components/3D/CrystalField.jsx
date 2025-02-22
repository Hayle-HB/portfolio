import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const CrystalField = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
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

    // Create crystal instances
    const crystals = [];
    const crystalCount = 1000; // Number of crystals
    const spread = 50; // Spread of the field

    // Create shared geometry and materials
    const geometries = [
      new THREE.TetrahedronGeometry(0.1, 0),
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.IcosahedronGeometry(0.1, 0),
    ];

    const colors = [
      0x88ccff, // Blue
      0xff88cc, // Pink
      0xccff88, // Green
      0xffcc88, // Orange
      0x88ffcc, // Cyan
    ];

    // Create crystal field
    for (let i = 0; i < crystalCount; i++) {
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        iridescence: 0.3,
        iridescenceIOR: 1.5,
      });

      const crystal = new THREE.Mesh(geometry, material);

      // Random position
      crystal.position.x = (Math.random() - 0.5) * spread;
      crystal.position.y = (Math.random() - 0.5) * spread;
      crystal.position.z = (Math.random() - 0.5) * spread;

      // Random rotation
      crystal.rotation.x = Math.random() * Math.PI;
      crystal.rotation.y = Math.random() * Math.PI;
      crystal.rotation.z = Math.random() * Math.PI;

      // Store original position
      crystal.userData.originalPosition = crystal.position.clone();
      // Random movement speed
      crystal.userData.speed = 0.5 + Math.random() * 0.5;
      // Random rotation speed
      crystal.userData.rotationSpeed = (Math.random() - 0.5) * 0.02;

      crystals.push(crystal);
      scene.add(crystal);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLights = [];
    const lightColors = [0xff7777, 0x7777ff, 0x77ff77];

    lightColors.forEach((color, i) => {
      const light = new THREE.PointLight(color, 2, 50);
      light.position.set(
        Math.cos((i * Math.PI * 2) / 3) * 10,
        Math.sin((i * Math.PI * 2) / 3) * 10,
        10
      );
      pointLights.push(light);
      scene.add(light);
    });

    // Camera position and movement
    camera.position.z = 30;
    let targetCameraZ = 30;

    // Mouse movement variables
    let mouseX = 0;
    let mouseY = 0;
    const mouseVector = new THREE.Vector3();

    // Handle mouse movement
    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / size) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / size) * 2 + 1;

      mouseVector.set((mouseX * spread) / 2, (mouseY * spread) / 2, 0);
    };

    // Handle scroll for zoom
    const handleWheel = (event) => {
      targetCameraZ = Math.max(
        15,
        Math.min(45, targetCameraZ + event.deltaY * 0.01)
      );
    };

    let time = 0;
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      // Update camera position
      camera.position.z += (targetCameraZ - camera.position.z) * 0.1;

      // Move lights
      pointLights.forEach((light, i) => {
        light.position.x = Math.cos(time + (i * Math.PI * 2) / 3) * 15;
        light.position.y = Math.sin(time + (i * Math.PI * 2) / 3) * 15;
      });

      // Update crystals
      crystals.forEach((crystal) => {
        // Distance from mouse
        const distanceToMouse = crystal.position.distanceTo(mouseVector);
        const influence = Math.max(0, 1 - distanceToMouse / 10);

        // Move towards mouse
        if (influence > 0) {
          crystal.position.lerp(
            mouseVector,
            influence * 0.03 * crystal.userData.speed
          );
        } else {
          // Return to original position
          crystal.position.lerp(crystal.userData.originalPosition, 0.02);
        }

        // Rotate
        crystal.rotation.x += crystal.userData.rotationSpeed;
        crystal.rotation.y += crystal.userData.rotationSpeed;
        crystal.rotation.z += crystal.userData.rotationSpeed;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel);

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
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      geometries.forEach((g) => g.dispose());
      crystals.forEach((c) => {
        c.material.dispose();
        scene.remove(c);
      });
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

export default CrystalField;
