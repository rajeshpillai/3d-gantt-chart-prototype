import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import GanttChart from '../Gantt/GanttChart';
import TimeAxis from '../Gantt/TimeAxis';
import TaskLabels from '../Gantt/TaskLabels';
import SalesPipeline from '../Pipeline/SalesPipeline';
import CircularKanban from '../Kanban/CircularKanban';
import TimeTravelAudit from '../Audit/TimeTravelAudit';
import ResourceTopology from '../Topology/ResourceTopology';
import DependencyGalaxy from '../Galaxy/DependencyGalaxy';
import type { ViewMode } from '../../App';
import { useTheme } from '../../ThemeContext';

interface SceneProps {
    viewMode: ViewMode;
}

// Camera Controller Component
const CameraController: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (viewMode === 'pipeline') {
            camera.position.set(0, 15, 30);
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.enableRotate = true;
                controlsRef.current.maxPolarAngle = Math.PI / 2;
            }
        } else if (viewMode === 'kanban') {
            camera.position.set(0, 5, 25);
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.enableRotate = true;
                controlsRef.current.maxPolarAngle = Math.PI / 2;
            }
        } else if (viewMode === 'audit') {
            camera.position.set(30, 20, 40);
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.enableRotate = true;
            }
        } else if (viewMode === 'topology') {
            camera.position.set(40, 30, 40);
            if (controlsRef.current) {
                controlsRef.current.target.set(10, 0, 0);
                controlsRef.current.enableRotate = true;
            }
        } else if (viewMode === 'galaxy') {
            camera.position.set(0, 20, 50);
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.enableRotate = true;
            }
        } else {
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
            minDistance={1}
            maxDistance={200}
        />
    );
};

const Scene: React.FC<SceneProps> = ({ viewMode }) => {
    const { colors } = useTheme();

    return (
        <Canvas
            camera={{ position: [50, 100, 200], fov: 60 }}
            style={{ background: colors.background, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            dpr={[1, 2]}
            gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
        >
            <CameraController viewMode={viewMode} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
            <pointLight position={[-10, -10, 10]} intensity={0.5} color={colors.secondary} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <fog attach="fog" args={[colors.background, 50, 500]} />

            {viewMode === 'pipeline' ? (
                <SalesPipeline />
            ) : viewMode === 'kanban' ? (
                <CircularKanban />
            ) : viewMode === 'audit' ? (
                <TimeTravelAudit />
            ) : viewMode === 'topology' ? (
                <ResourceTopology />
            ) : viewMode === 'galaxy' ? (
                <DependencyGalaxy />
            ) : (
                <group position={[-5, 5, 0]}>
                    <TimeAxis />
                    <GanttChart />
                    <TaskLabels />
                </group>
            )}

            <Environment preset="city" />

            {/* Post Processing */}
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.5}
                    mipmapBlur
                    intensity={0.5}
                    radius={0.4}
                />
            </EffectComposer>
        </Canvas>
    );
};

export default Scene;
