import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Particles({
  particleCount = 300,
  particleSpread = 8,
  speed = 0.04,
  particleColors = ["#ffffff"],
  moveParticlesOnHover = true,
  particleHoverFactor = 1.2,
  alphaParticles = true,
  particleBaseSize = 80,
  sizeRandomness = 1,
  cameraDistance = 22,
  disableRotation = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
    camera.position.z = cameraDistance;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * particleSpread * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * particleSpread * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * particleSpread * 2;

      const color = new THREE.Color(particleColors[Math.floor(Math.random() * particleColors.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = particleBaseSize * (1 + (Math.random() - 0.5) * sizeRandomness);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: alphaParticles,
      opacity: alphaParticles ? 0.7 : 1,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = new THREE.Vector2(0, 0);
    const onMouseMove = (e) => {
      if (!moveParticlesOnHover) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!disableRotation) {
        points.rotation.y += speed * 0.01;
        points.rotation.x += speed * 0.005;
      }
      if (moveParticlesOnHover) {
        points.rotation.y += mouse.x * speed * particleHoverFactor * 0.01;
        points.rotation.x += mouse.y * speed * particleHoverFactor * 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}