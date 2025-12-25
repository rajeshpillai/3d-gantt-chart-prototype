import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import GanttChart from './GanttChart';
import { THEME } from '../theme';

const Scene: React.FC = () => {
    return (
        <Canvas
            camera={{ position: [10, 5, 20], fov: 50 }}
            style={{ background: THEME.colors.background, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            dpr={[1, 2]}
        >
            <OrbitControls
                enableDamping
                dampingFactor={0.1}
                minDistance={5}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2} // Prevent going below ground
                target={[10, -5, 0]} // Look at center of chart roughly
            />

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
            <pointLight position={[-10, -10, 10]} intensity={0.5} color={THEME.colors.secondary} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Fog for depth */}
            <fog attach="fog" args={[THEME.colors.background, 20, 60]} />

            <group position={[-5, 5, 0]}>
                <GanttChart />
            </group>

            <Environment preset="city" />
        </Canvas>
    );
};

export default Scene;
