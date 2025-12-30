import { createEffect, onCleanup, onMount, type Component } from 'solid-js';
import * as THREE from 'three';
import { MOCK_DATA } from '../../mockData';
import { useTheme } from '../../ThemeContext';
import { useVirtualWindow } from '../../hooks/useVirtualWindow';
import { useThree } from '../Three/ThreeContext';

const TimeAxisVanilla: Component = () => {
    const { scene, overlay } = useThree();
    const theme = useTheme();
    // const renderRange = useVirtualWindow(() => MOCK_DATA.length);

    let lines: THREE.LineSegments;

    // Create container for HTML labels
    const labelContainer = document.createElement('div');
    labelContainer.style.position = 'absolute';
    labelContainer.style.top = '0';
    labelContainer.style.left = '0';
    labelContainer.style.width = '100%';
    labelContainer.style.height = '100%';
    labelContainer.style.pointerEvents = 'none';

    onMount(() => {
        // Add label container to overlay
        const overlayEl = overlay();
        if (overlayEl) {
            overlayEl.appendChild(labelContainer);
        }

        // Create geometry for lines
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({
            color: theme.colors().grid,
            transparent: true,
            opacity: 0.3
        });

        lines = new THREE.LineSegments(geometry, material);
        scene.add(lines);

        updateAxis();

        onCleanup(() => {
            if (overlayEl && labelContainer.parentNode === overlayEl) {
                overlayEl.removeChild(labelContainer);
            }
            scene.remove(lines);
            lines.geometry.dispose();
            (lines.material as THREE.Material).dispose();
        });
    });

    const updateAxis = () => {
        if (!lines) return;

        const metrics = theme.metrics;
        const totalDays = 30; // Mock total days
        const height = MOCK_DATA.length * metrics.rowHeight + 2;

        // Update lines
        const positions: number[] = [];

        for (let i = 0; i <= totalDays; i++) {
            const x = i * metrics.dayWidth;
            // Vertical line
            positions.push(x, 2, 0);
            positions.push(x, -height, 0);
        }

        lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        lines.geometry.computeBoundingSphere();

        // Update HTML labels
        labelContainer.innerHTML = '';
        // const { camera, renderer } = useThree();

        // Since labels need to move with camera, we should update them in a loop or effect
        // For static axis in 3D, we can project positions?
        // But better is to just render them based on projection in a useFrame loop
        // For now, let's just place them and rely on a simple update loop attached to the scene
    }

    // Effect to update labels on camera move would be ideal, 
    // but we can use the `frame` signal from context to trigger updates
    const { frame, camera, renderer } = useThree();

    createEffect(() => {
        frame(); // Track frame updates
        if (!labelContainer || !camera || !renderer) return;

        const metrics = theme.metrics;
        const totalDays = 30;

        // Clear previous connection logic if we were cacheing elements
        // For performance, we should cache DOM elements and just transform them

        // Initialize DOM elements once if empty
        if (labelContainer.children.length === 0) {
            for (let i = 0; i <= totalDays; i++) {
                const el = document.createElement('div');
                el.textContent = `Day ${i}`;
                el.style.position = 'absolute';
                el.style.color = theme.colors().text.muted;
                el.style.fontSize = '12px';
                el.style.transform = 'translate(-50%, -100%)';
                el.style.whiteSpace = 'nowrap';
                labelContainer.appendChild(el);
            }
        }

        // Update positions
        const width = renderer.domElement.clientWidth;
        const height = renderer.domElement.clientHeight;
        const widthHalf = width / 2;
        const heightHalf = height / 2;

        const vector = new THREE.Vector3();

        Array.from(labelContainer.children).forEach((child, i) => {
            const x = i * metrics.dayWidth;
            vector.set(x, 2.5, 0);
            vector.project(camera);

            // Check if behind camera
            if (vector.z > 1) {
                (child as HTMLElement).style.display = 'none';
                return;
            } else {
                (child as HTMLElement).style.display = 'block';
            }

            const screenX = (vector.x * widthHalf) + widthHalf;
            const screenY = -(vector.y * heightHalf) + heightHalf;

            (child as HTMLElement).style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -100%)`;
        });
    });

    createEffect(() => {
        theme.colors();
        if (lines) {
            (lines.material as THREE.LineBasicMaterial).color.set(theme.colors().grid);
        }
    });

    return null; // Renders to scene/overlay directly
};

export default TimeAxisVanilla;
