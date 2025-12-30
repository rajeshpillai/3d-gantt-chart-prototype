import { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../theme';

const BUFFER = 20; // Extra items to render outside view
const POOL_SIZE = 500; // Max items to render (visual window size)

export function useVirtualWindow(totalItems: number) {
    const { camera } = useThree();
    const [renderRange, setRenderRange] = useState({ start: 0, end: POOL_SIZE });
    const lastStartRef = useRef(0);

    useFrame(() => {
        // Calculate visible start based on camera Y
        // Camera moves positive Y to go UP. Chart grows negative Y.
        // If camera is at 0, we see roughly -H/2 to +H/2 (depending on FOV)
        // Actually, we usually pan DOWN (negative Y) to see lower tasks.
        // Let's assume standard camera view: LookAt(0, -Y, 0).

        // Approximate Y position of the camera's focus
        // For overhead view/scrolling, usually 'controls.target.y' or similar
        // But simply using camera.position.y is a decent proxy if mostly looking forward

        // Inverse: If camera.y is 10, we are looking at top.
        // If camera.y is -100, we are looking at index 1000.
        // Index Y = -(index * rowHeight)
        // So index = -Y / rowHeight

        const y = camera.position.y;
        const rowH = THEME.metrics.rowHeight;

        // When Y=0, index is 0. 
        // When Y=-100, index should be positive.
        // rough center index = -y / rowH.

        // But camera z affects FOV height.
        // Visible Height at distance D = 2 * D * tan(fov/2).
        const dist = camera.position.z;
        // @ts-ignore
        const vFOV = THREE.MathUtils.degToRad(camera.fov);
        const visibleHeight = 2 * dist * Math.tan(vFOV / 2);

        // Calculate top visible Y (max Y in view) and bottom visible Y (min Y in view)
        // Cam Y is center.
        const topY = y + visibleHeight / 2;
        // const bottomY = y - visibleHeight / 2;

        // Index at topY:
        // topY = -(index * rowH)  => index = -topY / rowH
        let startRaw = (-topY / rowH);

        if (startRaw < 0) startRaw = 0;

        const start = Math.floor(startRaw);

        // Throttle updates: only change if start index changes by > BUFFER/2
        if (Math.abs(start - lastStartRef.current) > BUFFER / 2) {
            lastStartRef.current = start;
            // Clamp
            const safeStart = Math.max(0, start - BUFFER);
            const safeEnd = Math.min(totalItems, safeStart + POOL_SIZE);
            setRenderRange({ start: safeStart, end: safeEnd });
        }
    });

    return renderRange;
}
