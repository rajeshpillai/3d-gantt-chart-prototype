import { createContext, useContext, type Accessor } from 'solid-js';
import * as THREE from 'three';

export interface ThreeContextValue {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    /** Accessor for the HTML overlay container element */
    overlay: Accessor<HTMLDivElement | undefined>;
    /** Current render frame count, useful for triggering updates */
    frame: Accessor<number>;
}

const ThreeContext = createContext<ThreeContextValue>();

export function useThree() {
    const context = useContext(ThreeContext);
    if (!context) {
        throw new Error('useThree must be used within a ThreeScene');
    }
    return context;
}

export default ThreeContext;
