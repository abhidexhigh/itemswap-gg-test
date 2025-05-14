import { useRef, useEffect } from "react";
import * as THREE from "three";

const BarGraph3D = ({ data }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    data.forEach((item, idx) => {
      const geometry = new THREE.BoxGeometry(0.5, item.value, 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: item.color || 0x00ff00,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = idx;
      cube.position.y = item.value / 2;
      scene.add(cube);
    });

    camera.position.z = 10;

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [data]);

  return <div ref={mountRef}></div>;
};

export default BarGraph3D;
