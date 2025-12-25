import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import GanttChart from './GanttChart';
import TimeAxis from './TimeAxis';
import { THEME } from '../theme';
import type { ViewMode } from '../App';

interface SceneProps {
    viewMode: ViewMode;
}

// Camera Controller Component
const CameraController: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (viewMode === 'horizontal') {
            // Animate to side view
            // Using simple interpolation would be better, but for now jumping is safer
            camera.position.set(20, 0, 0); // Side view
            camera.lookAt(20, 0, 0); // Look straight ahead? No, look at center
            if (controlsRef.current) {
                controlsRef.current.target.set(20, -5, 0);
                controlsRef.current.enableRotate = false; // "2D" mode
                controlsRef.current.maxPolarAngle = Math.PI;
                controlsRef.current.minPolarAngle = 0;
            }
        } else {
            // Perspective
            camera.position.set(10, 5, 20);
            if (controlsRef.current) {
                controlsRef.current.target.set(10, -5, 0);
                controlsRef.current.enableRotate = true;
                controlsRef.current.maxPolarAngle = Math.PI / 2;
            }
        }
    }, [viewMode, camera]);

    return (
        <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.1}
            minDistance={5}
            maxDistance={50}
            target={[10, -5, 0]}
        />
    );
};

const Scene: React.FC<SceneProps> = ({ viewMode }) => {
    return (
        <Canvas
            camera={{ position: [50, 100, 200], fov: 60 }}
            style={{ background: THEME.colors.background, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            dpr={[1, 2]}
            gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
        >
            <CameraController viewMode={viewMode} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
            <pointLight position={[-10, -10, 10]} intensity={0.5} color={THEME.colors.secondary} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Fog for depth - lighter in 2D? */}
            <fog attach="fog" args={[THEME.colors.background, 20, 60]} />

            <group position={[-5, 5, 0]}>
                <TimeAxis />
                <GanttChart />
            </group>

            <Environment preset="city" />

            {/* Post Processing */}
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.5}
                    mipmapBlur
                    intensity={1.5}
                    radius={0.4}
                />
            </EffectComposer>
        </Canvas>
    );
};

export default Scene;
