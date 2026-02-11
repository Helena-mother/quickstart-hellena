import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./Model";
import { Button } from "@/src/components/ui/button";
import { RotateCw, Pause, Eye, Box } from "lucide-react";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

interface CameraControllerProps {
  autoRotate: boolean;
  position: [number, number, number];
}

function CameraController({ autoRotate, position }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
  }, [position, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={autoRotate}
      enablePan={false}
      enableZoom={true}
      autoRotateSpeed={2}
      minDistance={2}
      maxDistance={10}
    />
  );
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-2xl">
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Box className="w-8 h-8 text-muted-foreground animate-pulse" />
        <span className="text-sm text-muted-foreground">Carregando modelo 3D...</span>
      </motion.div>
    </div>
  );
}

function ErrorFallback({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <div className="aspect-square w-full rounded-2xl bg-muted flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center p-6">
        <Box className="w-10 h-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Erro ao carregar modelo 3D</p>
        <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}

interface Model3DViewerProps {
  modelUrl: string;
  className?: string;
}

const viewPositions: { label: string; position: [number, number, number] }[] = [
  { label: "Frente", position: [0, 1, 4] },
  { label: "Direita", position: [4, 1, 0] },
  { label: "Esquerda", position: [-4, 1, 0] },
  { label: "Topo", position: [0, 5, 0.1] },
];

function Scene({ modelUrl, autoRotate, position }: { modelUrl: string; autoRotate: boolean; position: [number, number, number] }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      
      {/* Model */}
      <Suspense fallback={null}>
        <Model src={modelUrl} />
      </Suspense>

      <CameraController autoRotate={autoRotate} position={position} />
    </>
  );
}

export default function Model3DViewer({ modelUrl, className }: Model3DViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [position, setPosition] = useState<[number, number, number]>([3, 2, 3]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <motion.div
        className={`relative ${className}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* 3D Canvas */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted border border-border relative">
          {isLoading && <LoadingSpinner />}
          <Canvas
            camera={{ fov: 35, near: 0.1, far: 100 }}
            onCreated={() => setIsLoading(false)}
            gl={{ antialias: true }}
            style={{ background: '#f5f5f5' }}
          >
            <Scene modelUrl={modelUrl} autoRotate={autoRotate} position={position} />
          </Canvas>
        </div>

        {/* Controls overlay */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-card/90 backdrop-blur-md shadow-soft border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            size="sm"
            variant={autoRotate ? "default" : "ghost"}
            className="rounded-full h-9 px-3 gap-2"
            onClick={() => setAutoRotate(!autoRotate)}
          >
            {autoRotate ? (
              <Pause className="w-4 h-4" />
            ) : (
              <RotateCw className="w-4 h-4" />
            )}
            <span className="hidden sm:inline text-xs">
              {autoRotate ? "Parar" : "Girar"}
            </span>
          </Button>

          <div className="w-px h-6 bg-border" />

          {viewPositions.map((view) => (
            <Button
              key={view.label}
              size="sm"
              variant="ghost"
              className="rounded-full h-9 px-3 text-xs"
              onClick={() => setPosition(view.position)}
            >
              <Eye className="w-3 h-3 mr-1 sm:hidden" />
              <span className="hidden sm:inline">{view.label}</span>
              <span className="sm:hidden">{view.label.charAt(0)}</span>
            </Button>
          ))}
        </motion.div>

        {/* 3D badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5" />
          3D
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}
