import { createEffect, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import * as THREE from 'three';
import { MOCK_DATA } from '../../mockData';
import { useTheme } from '../../ThemeContext';
import { useVirtualWindow } from '../../hooks/useVirtualWindow';
import { useThree } from '../Three/ThreeContext';

const GanttBars: Component = () => {
    const { scene, camera, renderer } = useThree();
    const theme = useTheme();
    const renderRange = useVirtualWindow(() => MOCK_DATA.length);

    // Local state
    const [hoveredTask, setHoveredTask] = createSignal<any>(null);
    const [hoveredId, setHoveredId] = createSignal<number | null>(null);

    let instancedMesh: THREE.InstancedMesh;
    let raycaster: THREE.Raycaster;
    let pointer: THREE.Vector2;

    onMount(() => {
        // Initialize raycaster
        raycaster = new THREE.Raycaster();
        pointer = new THREE.Vector2();

        // Add lights
        if (!scene.getObjectByName('ambientLight')) {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            ambientLight.name = 'ambientLight';
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.name = 'directionalLight';
            directionalLight.position.set(10, 20, 10);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(theme.colors().secondary, 0.5);
            pointLight.name = 'pointLight';
            pointLight.position.set(-10, -10, 10);
            scene.add(pointLight);
        }

        // Create instanced mesh
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhysicalMaterial({
            transparent: true,
            opacity: 0.9,
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 1,
            toneMapped: false,
        });

        const range = renderRange();
        const visibleData = MOCK_DATA.slice(range.start, range.end);
        instancedMesh = new THREE.InstancedMesh(geometry, material, visibleData.length);
        instancedMesh.frustumCulled = false;
        instancedMesh.name = 'ganttBars';
        scene.add(instancedMesh);

        // Initial update
        updateTasks();

        // Event listeners
        const onPointerMove = (event: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObject(instancedMesh);

            if (intersects.length > 0) {
                const instanceId = intersects[0].instanceId;
                if (instanceId !== undefined) {
                    const range = renderRange();
                    const globalIndex = range.start + instanceId;
                    setHoveredId(globalIndex);
                    setHoveredTask(MOCK_DATA[globalIndex]);
                    renderer.domElement.style.cursor = 'pointer';
                }
            } else {
                setHoveredId(null);
                setHoveredTask(null);
                renderer.domElement.style.cursor = 'auto';
            }
        };

        const onPointerOut = () => {
            setHoveredId(null);
            setHoveredTask(null);
            renderer.domElement.style.cursor = 'auto';
        };

        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerout', onPointerOut);

        onCleanup(() => {
            renderer.domElement.removeEventListener('pointermove', onPointerMove);
            renderer.domElement.removeEventListener('pointerout', onPointerOut);

            if (instancedMesh) {
                scene.remove(instancedMesh);
                instancedMesh.geometry.dispose();
                (instancedMesh.material as THREE.Material).dispose();
            }
        });
    });

    const updateTasks = () => {
        if (!instancedMesh) return;

        const metrics = theme.metrics;
        const range = renderRange();
        const visibleData = MOCK_DATA.slice(range.start, range.end);
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        // Check if count needs update
        if (instancedMesh.count !== visibleData.length) {
            // In a real scenario we'd recreate mesh, but for now we assume fixed size or simpler logic
        }

        visibleData.forEach((task, i) => {
            const globalIndex = range.start + i;
            const x = (task.startDay + task.duration / 2) * metrics.dayWidth;
            const y = -globalIndex * metrics.rowHeight;
            const width = task.duration * metrics.dayWidth;

            dummy.position.set(x, y, 0);
            dummy.scale.set(width, metrics.barHeight, metrics.barDepth);
            dummy.updateMatrix();

            instancedMesh.setMatrixAt(i, dummy.matrix);

            // Set color based on hover state
            if (hoveredId() === globalIndex) {
                color.set(theme.colors().secondary);
            } else {
                color.set(theme.colors().primary);
            }
            instancedMesh.setColorAt(i, color);
        });

        instancedMesh.instanceMatrix.needsUpdate = true;
        if (instancedMesh.instanceColor) {
            instancedMesh.instanceColor.needsUpdate = true;
        }
    };

    // Effects
    createEffect(() => {
        theme.colors();
        if (instancedMesh) updateTasks();
    });

    createEffect(() => {
        hoveredId();
        if (instancedMesh) updateTasks();
    });

    return (
        <>
            {hoveredTask() && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    'backdrop-filter': 'blur(10px)',
                    border: `1px solid ${theme.colors().glassHigh}`,
                    color: theme.colors().text.main,
                    padding: '12px',
                    'border-radius': '8px',
                    'pointer-events': 'none',
                    'z-index': 2000,
                    'box-shadow': '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ 'font-weight': 'bold', 'margin-bottom': '4px' }}>{hoveredTask().name}</div>
                    <div style={{ 'font-size': '12px', opacity: 0.8 }}>
                        {hoveredTask().category} • {hoveredTask().progress}% • {hoveredTask().owner}
                    </div>
                </div>
            )}
        </>
    );
};

export default GanttBars;
