import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GanttChart from './GanttChart';
import BaseView from './BaseView';

interface LaptopRigProps {
    isOpen: boolean;
}

const LaptopRig: React.FC<LaptopRigProps> = ({ isOpen }) => {
    const hingeGroup = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (hingeGroup.current) {
            // Target angle: 0 (Open/Upright) to -Math.PI/2 (Closed/Flat)
            const targetRotation = isOpen ? 0 : -Math.PI / 2;
            hingeGroup.current.rotation.x = THREE.MathUtils.lerp(hingeGroup.current.rotation.x, targetRotation, delta * 5);
        }
    });

    return (
        <group position={[-10, 0, 0]}>
            {/* The Hinge/Screen Group */}
            <group ref={hingeGroup} position={[0, 0, 0]}>
                <group position={[0, 10, 0]}>
                    <GanttChart />
                </group>

                {/* Screen Frame/Backing */}
                <mesh position={[15, 5, -0.6]}>
                    <boxGeometry args={[32, 22, 0.5]} />
                    <meshPhysicalMaterial color="#222" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* Base (Keyboard) - Static */}
            <BaseView />
        </group>
    );
};

export default LaptopRig;
