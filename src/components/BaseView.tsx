import React from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { THEME } from '../theme';

const BaseView: React.FC = () => {
    // A simplified visual representation of the "Base" or "Keyboard" area
    // Just some cool sci-fi geometry for now
    return (
        <group>
            {/* The main slab */}
            <RoundedBox args={[30, 1, 20]} radius={0.5} smoothness={4} position={[15, -0.5, 10]}>
                <meshPhysicalMaterial
                    color="#111"
                    roughness={0.2}
                    metalness={0.8}
                    clearcoat={0.5}
                />
            </RoundedBox>

            {/* "Launch" Button Orb */}
            <group position={[25, 0, 15]}>
                <mesh>
                    <sphereGeometry args={[2, 32, 32]} />
                    <meshStandardMaterial
                        color={THEME.colors.secondary}
                        emissive={THEME.colors.secondary}
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
                <Text
                    position={[0, 2.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="bottom"
                    rotation={[-Math.PI / 2, 0, 0]} // Flat on ground
                >
                    LAUNCH
                </Text>
            </group>

            {/* Decorative Grid/Lines */}
            <gridHelper
                args={[20, 10, THEME.colors.primary, '#222']}
                position={[10, 0.1, 10]}
            />
        </group>
    );
};

export default BaseView;
