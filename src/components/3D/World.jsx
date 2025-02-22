import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const World = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup with enhanced quality
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    // Enhanced quality settings
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Set size to parent container with increased dimensions
    const container = mountRef.current;
    const size = Math.max(container.clientWidth, container.clientHeight) * 1.2;
    renderer.setSize(size, size);
    container.appendChild(renderer.domElement);

    // Create globe geometry with higher detail
    const geometry = new THREE.SphereGeometry(2.5, 128, 128); // Increased segments for better quality
    const textureLoader = new THREE.TextureLoader();

    // Load high-resolution textures with correct URLs
    const earthTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"
    );
    const bumpMap = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg"
    );
    const specularMap = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg"
    );
    const cloudsTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png"
    );

    // Enhance texture quality
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthTexture.minFilter = THREE.LinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    earthTexture.encoding = THREE.sRGBEncoding;

    // Create Earth material with enhanced properties
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.15,
      specularMap: specularMap,
      specular: new THREE.Color(0x333333),
      shininess: 15,
      normalScale: new THREE.Vector2(0.85, 0.85),
    });

    // Create main Earth sphere
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Create clouds layer with higher quality
    const cloudsGeometry = new THREE.SphereGeometry(2.53, 128, 128);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Create atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.65, 128, 128);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      map: null,
      transparent: true,
      opacity: 0.15,
      color: new THREE.Color(0x0077ff),
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(5, 3, 5);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x0077ff, 0.75);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    camera.position.z = 6;

    // Enable controls for user interaction while maintaining auto-rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = (3 * Math.PI) / 4;

    // Set initial rotation
    globe.rotation.x = 0.5;
    clouds.rotation.x = 0.5;
    atmosphere.rotation.x = 0.5;

    // Load profile texture
    const profileTexture = textureLoader.load("/profile.jpg"); // Use your image path

    // Create a circular profile display
    const profileGeometry = new THREE.CircleGeometry(2, 32);
    const profileMaterial = new THREE.MeshBasicMaterial({
      map: profileTexture,
      side: THREE.DoubleSide,
    });

    const profile = new THREE.Mesh(profileGeometry, profileMaterial);
    profile.position.z = 0.1;
    scene.add(profile);

    // Add a glowing ring around the profile
    const ringGeometry = new THREE.RingGeometry(2.1, 2.3, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = 0;
    scene.add(ring);

    // Animation loop with both auto-rotation and user control
    const animate = () => {
      requestAnimationFrame(animate);

      // Update controls for smooth damping
      controls.update();

      // Additional cloud rotation independent of earth movement
      clouds.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // Enhanced resize handler
    const handleResize = () => {
      const newSize =
        Math.max(container.clientWidth, container.clientHeight) * 1.2;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(newSize, newSize);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      earthTexture.dispose();
      bumpMap.dispose();
      specularMap.dispose();
      cloudsTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full scale-125 transform"
      style={{
        transform: "scale(1.25)",
        transformOrigin: "center center",
      }}
    />
  );
};

export default World;
