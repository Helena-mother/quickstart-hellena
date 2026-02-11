import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ModelProps {
  src: string;
  scale?: number;
}

export function Model({ src, scale = 1 }: ModelProps) {
  const { scene } = useGLTF(src);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);

      // Auto-scale to fit
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 2;
      const autoScale = targetSize / maxDim;
      modelRef.current.scale.setScalar(autoScale * scale);
    }
  }, [scene, scale]);

  return <primitive ref={modelRef} object={scene.clone()} />;
}
