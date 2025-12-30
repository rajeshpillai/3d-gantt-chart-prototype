import { onMount, onCleanup, type JSX, createSignal, type Component } from 'solid-js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ThreeContext, { type ThreeContextValue } from './ThreeContext';

export interface ThreeSceneProps {
    onSceneReady?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => void;
    cameraPosition?: [number, number, number];
    cameraFov?: number;
    enableControls?: boolean;
    style?: JSX.CSSProperties;
    children?: JSX.Element;
}

const ThreeScene: Component<ThreeSceneProps> = (props) => {
    let canvasRef!: HTMLCanvasElement;
    let overlayRef!: HTMLDivElement;

    // Reactive state for context
    const [contextValue, setContextValue] = createSignal<ThreeContextValue | undefined>(undefined);
    const [frame, setFrame] = createSignal(0);

    let animationId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls | null = null;

    onMount(() => {
        // Initialize Three.js
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            props.cameraFov || 60,
            canvasRef.clientWidth / canvasRef.clientHeight,
            0.1,
            1000
        );

        renderer = new THREE.WebGLRenderer({
            canvas: canvasRef,
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: true
        });

        // Setup renderer
        renderer.setSize(canvasRef.clientWidth, canvasRef.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.5;

        // Setup camera
        const camPos = props.cameraPosition || [10, 5, 20];
        camera.position.set(camPos[0], camPos[1], camPos[2]);

        // Setup controls if enabled
        if (props.enableControls !== false) {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.1;
            controls.minDistance = 1;
            controls.maxDistance = 200;
        }

        // Provide context
        setContextValue({
            scene,
            camera,
            renderer,
            overlay: () => overlayRef,
            frame: frame
        });

        // Handle resize
        const handleResize = () => {
            if (!canvasRef) return;
            const width = canvasRef.clientWidth;
            const height = canvasRef.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Notify parent that scene is ready
        props.onSceneReady?.(scene, camera, renderer);

        // Animation loop
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            if (controls) {
                controls.update();
            }

            renderer.render(scene, camera);
            setFrame(f => f + 1);
        };
        animate();

        // Cleanup
        onCleanup(() => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);

            if (controls) {
                controls.dispose();
            }

            renderer.dispose();

            // Dispose all scene objects
            scene.traverse((object: THREE.Object3D) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat: THREE.Material) => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        });
    });

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', ...props.style }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block'
                }}
            />
            {/* Overlay container for HTML labels */}
            <div
                ref={overlayRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    'pointer-events': 'none',
                    overflow: 'hidden'
                }}
            />

            {/* Render children only when context is ready */}
            {contextValue() && (
                <ThreeContext.Provider value={contextValue()!}>
                    {props.children}
                </ThreeContext.Provider>
            )}
        </div>
    );
};

export default ThreeScene;
