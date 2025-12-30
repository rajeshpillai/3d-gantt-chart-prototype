import { createEffect, onCleanup, onMount, type Component } from 'solid-js';
import * as THREE from 'three';
import { MOCK_DATA } from '../../mockData';
import { useTheme } from '../../ThemeContext';
import { useVirtualWindow } from '../../hooks/useVirtualWindow';
import { useThree } from '../Three/ThreeContext';

const TaskLabelsVanilla: Component = () => {
    const { overlay, frame, camera, renderer, scene } = useThree();
    const theme = useTheme();
    const renderRange = useVirtualWindow(() => MOCK_DATA.length);

    // Create container for HTML labels
    const labelContainer = document.createElement('div');
    labelContainer.style.position = 'absolute';
    labelContainer.style.top = '0';
    labelContainer.style.left = '0';
    labelContainer.style.width = '100%';
    labelContainer.style.height = '100%';
    labelContainer.style.pointerEvents = 'none';

    // Store label elements to reuse
    const labelElements: HTMLElement[] = [];

    // Connector lines in 3D scene
    let connectorLines: THREE.LineSegments;

    onMount(() => {
        const overlayEl = overlay();
        if (overlayEl) {
            overlayEl.appendChild(labelContainer);
        }

        // Create geometry for connector lines
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({
            color: theme.colors().text.muted,
            transparent: true,
            opacity: 0.2
        });
        connectorLines = new THREE.LineSegments(geometry, material);
        scene.add(connectorLines);

        onCleanup(() => {
            if (overlayEl && labelContainer.parentNode === overlayEl) {
                overlayEl.removeChild(labelContainer);
            }
            if (connectorLines) {
                scene.remove(connectorLines);
                connectorLines.geometry.dispose();
                (connectorLines.material as THREE.Material).dispose();
            }
        });
    });

    createEffect(() => {
        frame(); // Update on every frame
        if (!labelContainer || !camera || !renderer) return;

        const metrics = theme.metrics;
        const range = renderRange();
        const visibleData = MOCK_DATA.slice(range.start, range.end);

        // Ensure enough DOM elements exist
        while (labelElements.length < visibleData.length) {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.color = theme.colors().text.main;
            el.style.fontSize = '12px';
            el.style.whiteSpace = 'nowrap';
            el.style.textShadow = '0 1px 2px rgba(0,0,0,0.8)';
            el.style.transform = 'translate(0, -50%)'; // Center vertically
            el.style.pointerEvents = 'auto'; // Allow text selection? or keep none
            // Add subtle line to show connection
            el.innerHTML = '<span style="opacity:0.6; margin-right:4px;">—</span><span></span>';
            labelContainer.appendChild(el);
            labelElements.push(el);
        }

        // Hide unused elements
        for (let i = visibleData.length; i < labelElements.length; i++) {
            labelElements[i].style.display = 'none';
        }

        const width = renderer.domElement.clientWidth;
        const height = renderer.domElement.clientHeight;
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const vector = new THREE.Vector3();

        // Update lines geometry buffers

        visibleData.forEach((task, i) => {
            const el = labelElements[i];
            const globalIndex = range.start + i;

            // Calculate 3D position of the start of the bar
            const x = task.startDay * metrics.dayWidth;
            const y = -globalIndex * metrics.rowHeight;

            vector.set(x, y, 0);
            vector.project(camera);

            // Update DOM element content
            const span = el.lastElementChild;
            if (span && span.textContent !== task.name) {
                span.textContent = task.name;
            }

            // Check if behind camera
            if (vector.z > 1) {
                el.style.display = 'none';
                return;
            } else {
                el.style.display = 'block';
            }

            const screenX = (vector.x * widthHalf) + widthHalf;
            const screenY = -(vector.y * heightHalf) + heightHalf;

            // Offset label to the left of the start position
            el.style.transform = `translate(${screenX - 10}px, ${screenY}px) translate(-100%, -50%)`;

            // Add line segment (optional 3D line or just rely on CSS)
            // Ideally we'd draw lines in 3D for better depth, but 2D is fine.
            // Let's draw a vertical tick in 3D to mark the start clearly?
            // Or just leave it as is.
        });

        // If we were using lines, we'd update geometry here
    });

    createEffect(() => {
        theme.colors();
        if (connectorLines) {
            (connectorLines.material as THREE.LineBasicMaterial).color.set(theme.colors().text.muted);
        }
        // Update text colors
        labelElements.forEach(el => {
            el.style.color = theme.colors().text.main;
        });
    });

    return null;
};

export default TaskLabelsVanilla;
